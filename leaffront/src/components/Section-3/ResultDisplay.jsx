import React from "react";
import "./ResultDisplay.css";

function ResultDisplay({ result }) {
    // If the AI rejected the images or found a mix
    if (!result.success) {
        return (
            <div className="result-card error-card">
                <h3>Analysis Failed</h3>
                <p>{result.error}</p>
                <button className="retry-btn" onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </div>
        );
    }

    const { ai_greeting, prescription } = result;

    return (
        <div className="result-card success-card">
            <div className="ai-greeting">
                <span className="ai-icon">🤖</span>
                <p>{ai_greeting}</p>
            </div>

            {prescription && (
                <div className="prescription-content">
                    <div className="data-row">
                        <span className="label">Crop:</span>
                        <span className="value">{prescription.crop}</span>
                    </div>

                    <div className="data-row">
                        <span className="label">Disease:</span>
                        <span className="value highlight">{prescription.disease}</span>
                    </div>

                    {prescription.possible_reason && (
                        <div className="data-section">
                            <h4>Possible Reason</h4>
                            <p>{prescription.possible_reason}</p>
                        </div>
                    )}

                    {prescription.precaution_method && (
                        <div className="data-section">
                            <h4>Precautions</h4>
                            <p>{prescription.precaution_method}</p>
                        </div>
                    )}

                    {/* This will safely hide if treatment was deleted by your backend logic */}
                    {prescription.treatment && (
                        <div className="treatment-box">
                            <h4>💊 Recommended Treatment</h4>
                            <p><strong>Pesticide:</strong> {prescription.treatment.pesticide}</p>
                            {prescription.treatment.dosage_per_acre && (
                                <p><strong>Dosage:</strong> {prescription.treatment.dosage_per_acre} per acre</p>
                            )}
                            {prescription.treatment.water_required && (
                                <p><strong>Water:</strong> {prescription.treatment.water_required}</p>
                            )}
                        </div>
                    )}

                    {prescription.other_suggestion && (
                        <div className="data-section">
                            <h4>Additional Suggestions</h4>
                            <p>{prescription.other_suggestion}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ResultDisplay;