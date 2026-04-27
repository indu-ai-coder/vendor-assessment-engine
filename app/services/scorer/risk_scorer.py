def calculate_risk_score(gaps):
    """
    Simple scoring logic.
    You can tweak weights later.
    """

    score = 100

    for g in gaps:
        if g["status"] == "GAP":
            score -= 10
        elif g["status"] == "PARTIAL_MATCH":
            score -= 5

    return max(score, 0)

def get_risk_level(score):
    if score >= 85:
        return "LOW"
    elif score >= 70:
        return "MEDIUM-LOW"
    elif score >= 50:
        return "MEDIUM"
    elif score >= 30:
        return "MEDIUM-HIGH"
    else:
        return "HIGH"