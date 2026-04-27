// ---------------- NAVIGATION ----------------

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        const section = link.getAttribute('data-section');
        console.log("Switching to:", section);

        showSection(section);

        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

function showSection(section) {
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.style.display = 'none';
    });

    const target = document.getElementById(`${section}-section`);

    if (target) {
        target.style.display = 'block';
    } else {
        console.error(`❌ Section not found: ${section}-section`);
    }
}


// ---------------- FILE UPLOAD ----------------

const uploadForm = document.getElementById('uploadForm');

if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const questionnaire = document.getElementById('questionnaire')?.files[0];
        const policy = document.getElementById('policy')?.files[0];

        if (!questionnaire || !policy) {
            showAlert('Please select both files', 'error');
            return;
        }

        showLoading(true);

        try {
            const formData = new FormData();
            formData.append('questionnaire', questionnaire);
            formData.append('policy', policy);

            const response = await fetch('/assess', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            displayReport(data);

            activateReportTab();

        } catch (error) {
            console.error(error);
            showAlert(`Error: ${error.message}`, 'error');
        } finally {
            showLoading(false);
        }
    });
}


// ---------------- LOCAL TEST ----------------

const localTestBtn = document.getElementById('runLocalTest');

if (localTestBtn) {
    localTestBtn.addEventListener('click', async () => {

        // Show local section immediately (better UX)
        showSection('local-test');

        showLoading(true);

        try {
            const response = await fetch('/assess-local');
            const data = await response.json();

            console.log("Local Test Data:", data);

            displayReport(data);

            activateReportTab();

        } catch (error) {
            console.error(error);
            showAlert(`Error: ${error.message}`, 'error');
        } finally {
            showLoading(false);
        }
    });
}


// ---------------- REPORT RENDER ----------------

function displayReport(data) {

    const reportContent = document.getElementById('reportContent');
    if (!reportContent) return;

    let gaps = Array.isArray(data.gaps) ? data.gaps : Object.values(data.gaps || []);

    const gapCount = gaps.filter(g => g.status === 'GAP').length;
    const partialCount = gaps.filter(g => g.status === 'PARTIAL_MATCH').length;
    const compliantCount = gaps.filter(g => g.status === 'FULL_MATCH').length;

    const riskLevel = data.risk_level || getRiskLevel(data.risk_score);
    const riskClass = getRiskClassFromLevel(riskLevel);

    let html = `
        <div class="card">
            <div class="card-header bg-danger text-white">
                <h5>Assessment Report</h5>
            </div>

            <div class="card-body">

                <div class="risk-score-container">
                    <div class="risk-score-value">${data.risk_score}</div>
                    <div class="risk-indicator ${riskClass}">
                        ${riskLevel} RISK (${data.risk_score})
                    </div>
                </div>

                <h6 class="mt-4">Summary</h6>
                <ul>
                    <li>Total: ${gaps.length}</li>
                    <li>Compliant: ${compliantCount}</li>
                    <li>Partial: ${partialCount}</li>
                    <li>Gaps: ${gapCount}</li>
                </ul>

                ${renderGapsTable(gaps)}

            </div>
        </div>
    `;

    reportContent.innerHTML = html;
}


// ---------------- TABLE ----------------

function renderGapsTable(gaps) {

    if (!gaps.length) return "<p>No data</p>";

    let html = `
        <table class="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>QID</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Issue</th>
                </tr>
            </thead>
            <tbody>
    `;

    gaps.forEach((gap, index) => {

        let priority = gap.status === "FULL_MATCH" ? "NONE" : (gap.priority || "MEDIUM");

        html += `
            <tr>
                <td>${index + 1}</td>

                <td>${escapeHtml(gap.question_id)}</td>

                <td>
                    <span style="background:${getStatusColor(gap.status)};color:white;padding:4px 8px;border-radius:4px;">
                        ${formatStatus(gap.status)}
                    </span>
                </td>

                <td>
                    <span style="background:${getPriorityColor(priority)};color:white;padding:4px 8px;border-radius:4px;">
                        ${priority}
                    </span>
                </td>

                <td>${escapeHtml(gap.reason)}</td>
            </tr>
        `;
    });

    html += "</tbody></table>";

    return html;
}


// ---------------- HELPERS ----------------

function activateReportTab() {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    const reportTab = document.querySelector('[data-section="report"]');
    if (reportTab) reportTab.classList.add('active');

    showSection('report');
}

function getStatusColor(status) {
    if (status === "FULL_MATCH") return "#27ae60";
    if (status === "PARTIAL_MATCH") return "#f39c12";
    if (status === "GAP") return "#e74c3c";
    return "#95a5a6";
}

function getPriorityColor(level) {
    if (level === "HIGH") return "#e74c3c";
    if (level === "MEDIUM-HIGH") return "#e67e22";
    if (level === "MEDIUM") return "#f39c12";
    if (level === "MEDIUM-LOW") return "#f1c40f";
    if (level === "LOW") return "#2ecc71";
    return "#95a5a6";
}

function getRiskLevel(score) {
    if (score >= 85) return "LOW";
    if (score >= 70) return "MEDIUM-LOW";
    if (score >= 50) return "MEDIUM";
    if (score >= 30) return "MEDIUM-HIGH";
    return "HIGH";
}

function getRiskClassFromLevel(level) {
    return level.toLowerCase();
}

function formatStatus(status) {
    if (status === "FULL_MATCH") return "COMPLIANT";
    if (status === "PARTIAL_MATCH") return "PARTIAL";
    return status;
}

function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = show ? 'flex' : 'none';
}

function showAlert(message, type) {
    alert(message); // simple fallback
}

function escapeHtml(text) {
    return String(text || "").replace(/[&<>"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[m]));
}


// ---------------- INIT ----------------

showSection('upload');