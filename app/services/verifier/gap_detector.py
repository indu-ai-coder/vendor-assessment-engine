def detect_gaps(responses, policy_text):
    """
    Rule-based gap detection (Phase 1)
    Later → replace with LLM + RAG
    """

    results = []

    for r in responses:
        q = (r.get("question") or "").lower()

        status = "UNKNOWN"
        reason = ""

        # Encryption at rest
        if "encrypt data at rest" in q:
            if "aes-256" in policy_text:
                status = "FULL_MATCH"
            else:
                status = "GAP"
                reason = "Encryption at rest not found in policy"

        # Encryption in transit
        elif "encrypt data in transit" in q:
            if "tls" in policy_text:
                status = "FULL_MATCH"
            else:
                status = "GAP"
                reason = "TLS not found"

        # MFA
        elif "multi-factor authentication" in q or "mfa" in q:
    
            mfa_keywords = [
                "mfa",
                "multi-factor authentication",
                "multi factor authentication",
                "two-factor authentication",
                "two factor authentication",
                "2fa"
            ]

            if any(keyword in policy_text for keyword in mfa_keywords):
                status = "FULL_MATCH"
            else:
                status = "GAP"
                reason = "MFA / 2FA not found in policy"

        # Access review
        elif "access rights reviewed" in q:
            if "quarterly" in policy_text:
                status = "FULL_MATCH"
            else:
                status = "PARTIAL_MATCH"
                reason = "Access review unclear"

        # Breach timeline
        elif "breach notification" in q:
            if "72" in policy_text and "hour" in policy_text:
                status = "FULL_MATCH"
            else:
                status = "GAP"
                reason = "Breach timeline not found"

        # Data retention
        elif "data retention" in q:
            if "30" in policy_text:
                status = "FULL_MATCH"
            elif "retention" in policy_text:
                status = "PARTIAL_MATCH"
                reason = "Retention mentioned but not specific"
            else:
                status = "GAP"
                reason = "No retention policy found"

        # Compliance
        elif "certifications" in q:
            if any(x in policy_text for x in ["iso 27001", "soc 2"]):
                status = "FULL_MATCH"
            else:
                status = "GAP"
                reason = "Certifications not found"
        
        if status == "UNKNOWN":
            status = "GAP"
            reason = "Control not evaluated"

        results.append({
            "question_id": r.get("question_id"),
            "status": status,
            "reason": reason
        })

    return results