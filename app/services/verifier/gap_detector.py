from app.services.verifier.control_config import CONTROL_CONFIG


def normalize(text):
    return text.lower().replace("-", " ")


def contains_any(text, keywords):
    return any(k in text for k in keywords)


def detect_gaps(responses, policy_text):

    policy_text = normalize(policy_text)
    results = []

    for r in responses:
        question = normalize(r.get("question", ""))

        # Reset per iteration (VERY IMPORTANT)
        status = None
        reason = ""

        matched_control = None

        # Find matching control
        for control in CONTROL_CONFIG:
            if contains_any(question, control["question_keywords"]):
                matched_control = control
                break

        if not matched_control:
            results.append({
                "question_id": r.get("question_id"),
                "status": "GAP",
                "reason": "Control not mapped",
                "control_id": None,
                "priority": "MEDIUM"
            })
            continue

        # FULL MATCH
        if contains_any(policy_text, matched_control["evidence_keywords"]):
            status = "FULL_MATCH"
            reason = ""
            priority = "NONE"

        # PARTIAL MATCH
        elif contains_any(policy_text, matched_control["partial_keywords"]):
            print(
                f"[DEBUG] Control={matched_control['id']} | "
                f"Question={question} | "
                f"Matched PARTIAL via keywords={matched_control['partial_keywords']}"
            )

            status = "PARTIAL_MATCH"
            reason = "Mentioned but not specific"
            priority = "MEDIUM"

        # GAP
        else:
            status = "GAP"
            reason = matched_control["gap_reason"]
            priority = "MEDIUM"

        # Final debug (VERY useful)
        print(f"[FINAL DEBUG] Q={r.get('question_id')} | Status={status} | Reason={reason}")

        results.append({
            "question_id": r.get("question_id"),
            "status": status,
            "reason": reason,
            "control_id": matched_control["id"],
            "priority": priority
        })

    return results