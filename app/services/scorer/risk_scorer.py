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