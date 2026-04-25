from flask import Flask, request, jsonify

from app.services.parser.questionnaire_parser import parse_questionnaire
from app.services.parser.policy_parser import parse_policy
from app.services.verifier.gap_detector import detect_gaps
from app.services.scorer.risk_scorer import calculate_risk_score

app = Flask(__name__)


@app.route("/", methods=["GET"])
def home():
    print("✅ HOME ROUTE HIT")
    return {
        "message": "Vendor Assessment Engine is running",
        "endpoint": "/assess (POST)"
    }


@app.route("/assess-local", methods=["GET"])
def assess_local():
    """
    Runs assessment using local files (no upload needed)
    Useful for testing & development
    """

    questionnaire_path = "data/vendor_questionnaire.csv"
    policy_path = "data/vendor_policy.pdf"

    print("📥 Parsing questionnaire...")
    with open(questionnaire_path, "rb") as qf:
        responses = parse_questionnaire(qf)

    print("📄 Extracting policy text...")
    with open(policy_path, "rb") as pf:
        policy_text = parse_policy(pf)

    print("🔍 Running gap detection...")
    gaps = detect_gaps(responses, policy_text)

    print("📊 Calculating risk score...")
    score = calculate_risk_score(gaps)

    return jsonify({
        "mode": "local",
        "risk_score": score,
        "gaps": gaps
    }
)

@app.route("/assess", methods=["POST"])
def assess():
    """
    Upload:
    - questionnaire CSV
    - policy PDF
    """

    questionnaire_file = request.files.get("questionnaire")
    policy_file = request.files.get("policy")

    if not questionnaire_file or not policy_file:
        return jsonify({"error": "Both files required"}), 400

    # Parse
    responses = parse_questionnaire(questionnaire_file.stream)
    policy_text = parse_policy(policy_file.stream)

    # Process
    gaps = detect_gaps(responses, policy_text)
    score = calculate_risk_score(gaps)

    return jsonify({
        "risk_score": score,
        "gaps": gaps
    })


if __name__ == "__main__":
    print("🚀 Flask app starting...")
    app.run(debug=True, port=8000)