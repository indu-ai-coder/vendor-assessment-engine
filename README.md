# Vendor Assessment Engine

A Flask-based API for automated vendor risk assessment. The engine analyzes vendor questionnaires against company policies to identify gaps and calculate risk scores.

## Features

- **Policy Parsing**: Extract and process vendor policy documents (PDF)
- **Questionnaire Analysis**: Parse vendor responses from CSV files
- **Gap Detection**: Identify compliance gaps between vendor policies and requirements
- **Risk Scoring**: Calculate quantitative risk scores based on detected gaps
- **Dual API Modes**:
  - `/assess-local` - Test with local files (development)
  - `/assess` - Upload files via POST request (production)
- **Web Dashboard**: Interactive UI for uploading files and viewing assessment reports in table format
- **Real-time Reporting**: Display risk scores and detected gaps with visualizations

## Project Structure

```
vendor-assessment-engine/
├── app/
│   ├── main.py                    # Flask application entry point
│   ├── main_fastapi.py            # Alternative FastAPI implementation
│   └── services/
│       ├── parser/
│       │   ├── policy_parser.py      # PDF policy extraction
│       │   └── questionnaire_parser.py # CSV questionnaire parsing
│       ├── scorer/
│       │   └── risk_scorer.py         # Risk calculation logic
│       └── verifier/
│           └── gap_detector.py        # Gap detection engine
├── static/
│   ├── index.html                 # Web dashboard UI
│   ├── styles.css                 # Dashboard styling
│   └── script.js                  # Frontend logic
├── data/
│   └── vendor_questionnaire.csv   # Sample vendor responses
├── requirements.txt               # Python dependencies
├── .gitignore                     # Git ignore rules
└── README.md                      # This file
```

## Installation

### Prerequisites
- Python 3.8+
- pip

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vendor-assessment-engine.git
   cd vendor-assessment-engine
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### Run Flask Application
```bash
python -m app.main
```
Server runs on `http://localhost:8000`

### API Endpoints

#### 1. Health Check
```bash
GET /
```
Response:
```json
{
  "message": "Vendor Assessment Engine is running",
  "endpoint": "/assess (POST)"
}
```

#### 2. Local Assessment (Development)
```bash
GET /assess-local
```
Requires:
- `data/vendor_questionnaire.csv` - Vendor responses
- `data/vendor_policy.pdf` - Vendor policy document

Response:
```json
{
  "mode": "local",
  "risk_score": 75,
  "gaps": ["Gap 1", "Gap 2", ...]
}
```

#### 3. Upload Assessment (Production)
```bash
POST /assess
Content-Type: multipart/form-data

Fields:
- questionnaire: CSV file
- policy: PDF file
```

Response:
```json
{
  "risk_score": 75,
  "gaps": ["Gap 1", "Gap 2", ...]
}
```

## API Testing

### Using cURL
```bash
# Local assessment
curl http://localhost:8000/assess-local

# Upload assessment
curl -F "questionnaire=@vendor_questionnaire.csv" \
     -F "policy=@vendor_policy.pdf" \
     http://localhost:8000/assess
```

### Using Python Requests
```python
import requests

# Upload files
files = {
    'questionnaire': open('data/vendor_questionnaire.csv', 'rb'),
    'policy': open('data/vendor_policy.pdf', 'rb')
}
response = requests.post('http://localhost:8000/assess', files=files)
print(response.json())
```

## Web Dashboard

The application includes an interactive web-based dashboard for easy assessment management.

### Accessing the Dashboard
Open your browser and navigate to: `http://localhost:8000`

### Dashboard Features

1. **Upload Section**
   - Drag-and-drop file upload interface
   - Support for CSV questionnaires and PDF policies
   - Clear validation and error messages

2. **Report Display**
   - Risk score visualization
   - Risk level indicator (Low/Medium/High)
   - Detailed gap analysis in table format
   - Gap count summary

3. **Local Test Mode**
   - Quick testing with pre-configured local files
   - Useful for development and debugging

### UI Components

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Processing**: Instant feedback during assessment
- **Data Visualization**: Risk scores and metrics clearly displayed
- **Export Functionality**: Download assessment reports as JSON
- **Sidebar Navigation**: Easy access to all features

## Configuration

Environment variables (create `.env` file):
```
FLASK_ENV=development
FLASK_DEBUG=True
PORT=8000
```

## Development

### Run in Debug Mode
```bash
python -m app.main
```
Server auto-reloads on code changes.

### Testing
```bash
# Run with local data
GET /assess-local
```

## Requirements

See [requirements.txt](requirements.txt) for all dependencies:
- Flask - Web framework
- python-dotenv - Environment variables
- Additional PDF/CSV parsing libraries

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Push to your branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions, please open an issue on GitHub.

---

**Author**: Indumathi
**Last Updated**: April 2026
