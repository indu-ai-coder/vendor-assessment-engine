// Navigation handling
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('data-section');
        showSection(section);
        
        // Update active state
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.style.display = 'none';
    });
    
    // Show selected section
    switch(section) {
        case 'upload':
            document.getElementById('upload-section').style.display = 'block';
            break;
        case 'report':
            document.getElementById('report-section').style.display = 'block';
            break;
        case 'local-test':
            document.getElementById('local-test-section').style.display = 'block';
            break;
    }
}

// Form submission
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const questionnaire = document.getElementById('questionnaire').files[0];
    const policy = document.getElementById('policy').files[0];
    
    if (!questionnaire || !policy) {
        showAlert('Please select both files', 'error');
        return;
    }
    
    // Show loading spinner
    showLoading(true);
    
    try {
        const formData = new FormData();
        formData.append('questionnaire', questionnaire);
        formData.append('policy', policy);
        
        const response = await fetch('/assess', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Assessment response:', data);
        displayReport(data);
        
        // Navigate to report
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector('[data-section="report"]').classList.add('active');
        showSection('report');
        
    } catch (error) {
        console.error('Error:', error);
        showAlert(`Error: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
});

// Local test button
document.getElementById('runLocalTest').addEventListener('click', async () => {
    showLoading(true);
    
    try {
        const response = await fetch('/assess-local');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Local test response:', data);
        displayReport(data);
        
        // Navigate to report
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector('[data-section="report"]').classList.add('active');
        showSection('report');
        
    } catch (error) {
        console.error('Error:', error);
        showAlert(`Error: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
});

function displayReport(data) {
    try {
        const reportContent = document.getElementById('reportContent');
        
        // Validate data
        if (!data) {
            showAlert('Invalid report data received', 'error');
            return;
        }
        
        // Ensure gaps is an array
        let gaps = data.gaps || [];
        if (!Array.isArray(gaps)) {
            gaps = Object.values(gaps);
        }
        
        // Count different statuses
        const gapCount = gaps.filter(gap => {
            if (typeof gap === 'object' && gap !== null) {
                return gap.status === 'GAP';
            }
            return false;
        }).length;
        
        const partialCount = gaps.filter(gap => {
            if (typeof gap === 'object' && gap !== null) {
                return gap.status === 'PARTIAL_MATCH';
            }
            return false;
        }).length;
        
        const compliantCount = gaps.filter(gap => {
            if (typeof gap === 'object' && gap !== null) {
                return gap.status === 'FULL_MATCH';
            }
            return false;
        }).length;
        
        const riskLevel = getRiskLevel(data.risk_score);
        const riskClass = getRiskClass(data.risk_score);
        
        let html = `
            <div class="card">
                <div class="card-header" style="background: linear-gradient(90deg, #dc3545 0%, #c82333 100%); color: white;">
                    <h5 class="mb-0"><i class="bi bi-file-text"></i> Assessment Report</h5>
                </div>
                <div class="card-body">
                    <div class="risk-score-container">
                        <div class="risk-score-item">
                            <div class="risk-score-value">${data.risk_score}</div>
                            <div class="risk-score-label">Risk Score (0-100)</div>
                        </div>
                        <div class="risk-score-item">
                            <div class="risk-indicator ${riskClass}">${riskLevel}</div>
                        </div>
                    </div>
                    
                    <div class="row mb-4">
                        <div class="col-md-8">
                            <h6 class="text-muted text-uppercase mb-3">Assessment Summary</h6>
                            <ul class="list-unstyled">
                                <li class="mb-2">
                                    <span class="badge" style="background-color: #95a5a6;">Total Controls Checked</span>
                                    <span class="ms-2 fw-bold">${gaps.length}</span>
                                </li>
                                <li class="mb-2">
                                    <span class="badge" style="background-color: #27ae60; color: white;">Compliant (Full Match)</span>
                                    <span class="ms-2 fw-bold">${compliantCount}</span>
                                </li>
                                <li class="mb-2">
                                    <span class="badge" style="background-color: #f39c12; color: white;">Partial Match</span>
                                    <span class="ms-2 fw-bold">${partialCount}</span>
                                </li>
                                <li class="mb-2">
                                    <span class="badge" style="background-color: #dc3545;">Critical Gaps</span>
                                    <span class="ms-2 fw-bold">${gapCount}</span>
                                </li>
                                <li class="mb-2">
                                    <span class="badge" style="background-color: #2c3e50;">Risk Level</span>
                                    <span class="ms-2 fw-bold">${riskLevel}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <h6 class="text-uppercase text-muted mb-3">Detailed Control Analysis</h6>
                    ${renderGapsTable(gaps)}
                    
                    <div class="mt-4">
                        <button class="btn btn-secondary" onclick="downloadReport('${JSON.stringify(data).replace(/'/g, "&#39;")}')">
                            <i class="bi bi-download"></i> Download Report
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        reportContent.innerHTML = html;
    } catch (error) {
        console.error('Error displaying report:', error);
        showAlert(`Error displaying report: ${error.message}`, 'error');
    }
}

function renderGapsTable(gaps) {
    if (!gaps || gaps.length === 0) {
        return '<div class="alert" style="background-color: #bdc3c7; color: #2c3e50; border-radius: 5px;"><i class="bi bi-check-circle"></i> No controls evaluated!</div>';
    }
    
    let html = '<div class="table-container"><table class="table table-striped"><thead><tr><th>#</th><th>Question ID</th><th>Status</th><th>Issue</th></tr></thead><tbody>';
    
    gaps.forEach((gap, index) => {
        let qId = '';
        let status = '';
        let reason = '';
        
        if (typeof gap === 'object' && gap !== null) {
            qId = gap.question_id || '';
            status = gap.status || 'UNKNOWN';
            reason = gap.reason || 'Compliant';
        } else if (typeof gap === 'string') {
            reason = gap;
        } else {
            reason = String(gap);
        }
        
        // Determine status badge color
        let statusBadgeClass = 'bg-secondary';
        let statusBgColor = '#95a5a6';
        
        if (status === 'FULL_MATCH') {
            statusBadgeClass = 'badge-success';
            statusBgColor = '#27ae60';
        } else if (status === 'PARTIAL_MATCH') {
            statusBadgeClass = 'bg-warning';
            statusBgColor = '#f39c12';
        } else if (status === 'GAP') {
            statusBadgeClass = 'bg-danger';
            statusBgColor = '#dc3545';
        }
        
        html += `
            <tr>
                <td><span class="badge" style="background-color: #95a5a6;">${index + 1}</span></td>
                <td>${escapeHtml(qId)}</td>
                <td><span class="badge" style="background-color: ${statusBgColor}; color: white;">${escapeHtml(status)}</span></td>
                <td>${escapeHtml(reason)}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    return html;
}

function getRiskLevel(score) {
    if (score >= 70) return 'HIGH RISK';
    if (score >= 40) return 'MEDIUM RISK';
    return 'LOW RISK';
}

function getRiskClass(score) {
    if (score >= 70) return 'risk-high';
    if (score >= 40) return 'risk-medium';
    return 'risk-low';
}

function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    spinner.style.display = show ? 'flex' : 'none';
}

function showAlert(message, type) {
    const alertBgColor = type === 'error' ? '#dc3545' : '#bdc3c7';
    const alertTextColor = type === 'error' ? 'white' : '#2c3e50';
    const alertHtml = `
        <div class="alert alert-dismissible fade show" role="alert" style="background-color: ${alertBgColor}; color: ${alertTextColor}; border-radius: 5px; margin-bottom: 1rem;">
            <i class="bi bi-info-circle"></i> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" style="filter: ${type === 'error' ? 'brightness(1.5)' : 'brightness(0.5)'}"></button>
        </div>
    `;
    
    const alertContainer = document.querySelector('main');
    const alertElement = document.createElement('div');
    alertElement.innerHTML = alertHtml;
    alertContainer.insertBefore(alertElement, alertContainer.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        alertElement.remove();
    }, 5000);
}

function downloadReport(dataStr) {
    try {
        const data = JSON.parse(dataStr);
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `assessment_report_${new Date().getTime()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showAlert('Report downloaded successfully!', 'success');
    } catch (error) {
        showAlert('Error downloading report', 'error');
    }
}

function escapeHtml(text) {
    // Ensure text is a string
    if (!text || typeof text !== 'string') {
        text = String(text || '');
    }
    
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Initialize
showSection('upload');
