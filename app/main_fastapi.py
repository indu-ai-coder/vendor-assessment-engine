from flask import app

from app.services.parser.questionnaire_parser import parse_questionnaire
from app.services.parser.policy_parser import parse_policy
from app.services.verifier.gap_detector import detect_gaps
from app.services.scorer.risk_scorer import calculate_risk_score


def run_assessment():
    questionnaire_path = "data/vendor_questionnaire.csv"
    policy_path = "data/vendor_policy.pdf"

    print("📥 Parsing questionnaire...")
    responses = parse_questionnaire(questionnaire_path)

    print("📄 Extracting policy text...")
    policy_text = parse_policy(policy_path)

    print("🔍 Running gap detection...")
    gaps = detect_gaps(responses, policy_text)

    print("📊 Calculating risk score...")
    score = calculate_risk_score(gaps)

    print("\n===== ASSESSMENT RESULT =====")
    print(f"Risk Score: {score}")

    for g in gaps:
        print(g)


if __name__ == "__main__":
    print("🚀 Flask app starting...")
    run_assessment()

@app.route("/", methods=["GET"])
def home():
    print("✅ HOME ROUTE HIT")
    return {
        "message": "Vendor Assessment Engine is running",
        "endpoint": "/assess (POST)"
    }