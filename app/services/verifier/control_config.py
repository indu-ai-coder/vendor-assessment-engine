CONTROL_CONFIG = [

    # 1. Encryption at Rest
    {
        "id": "ENCRYPTION_AT_REST",
        "question_keywords": [
            "encrypt data at rest",
            "encryption at rest"
        ],
        "evidence_keywords": [
            "aes-256",
            "encryption at rest"
        ],
        "partial_keywords": [],
        "gap_reason": "Encryption at rest not found in policy",
        "priority": "HIGH"
    },

    # 2. Encryption in Transit
    {
        "id": "ENCRYPTION_IN_TRANSIT",
        "question_keywords": [
            "encrypt data in transit",
            "encryption in transit"
        ],
        "evidence_keywords": [
            "tls",
            "https"
        ],
        "partial_keywords": [],
        "gap_reason": "TLS not found",
        "priority": "HIGH"
    },

    # 3. MFA
    {
        "id": "MFA",
        "question_keywords": [
            "multi-factor authentication",
            "mfa"
        ],
        "evidence_keywords": [
            "mfa",
            "multi factor authentication",
            "multi-factor authentication",
            "two factor authentication",
            "two-factor authentication",
            "2fa"
        ],
        "partial_keywords": [],
        "gap_reason": "MFA / 2FA not found in policy",
        "priority": "HIGH"
    },

    # 4. Access Review
    {
        "id": "ACCESS_REVIEW",
        "question_keywords": [
            "access rights reviewed",
            "access review"
        ],
        "evidence_keywords": [
            "quarterly"
        ],
        "partial_keywords": [
            "review"
        ],
        "gap_reason": "Access review not clearly defined",
        "priority": "MEDIUM"
    },

    # 5. Incident Response
    {
        "id": "INCIDENT_RESPONSE",
        "question_keywords": [
            "incident response",
            "incident response plan"
        ],
        "evidence_keywords": [
            "incident response",
            "incident management",
            "security incident",
            "incident handling"
        ],
        "partial_keywords": [],
        "gap_reason": "Incident response capability not found",
        "priority": "HIGH"
    },

    # 6. Breach Notification Timeline
    {
        "id": "BREACH_NOTIFICATION",
        "question_keywords": [
            "breach notification"
        ],
        "evidence_keywords": [
            "72 hour",
            "72 hours"
        ],
        "partial_keywords": [
            "breach",
            "notification"
        ],
        "gap_reason": "Breach timeline not defined",
        "priority": "HIGH"
    },

    # 7. Data Retention
    {
        "id": "DATA_RETENTION",
        "question_keywords": [
            "data retention"
        ],
        "evidence_keywords": [
            "30 day",
            "30 days"
        ],
        "partial_keywords": [
            "retention"
        ],
        "gap_reason": "No retention policy found",
        "priority": "MEDIUM"
    },

    # 8. Compliance Certifications
    {
        "id": "COMPLIANCE",
        "question_keywords": [
            "certifications"
        ],
        "evidence_keywords": [
            "iso 27001",
            "soc 2",
            "soc2"
        ],
        "partial_keywords": [
            "compliance framework",
            "compliance"
        ],
        "gap_reason": "Certifications not found",
        "priority": "LOW"
    }
]