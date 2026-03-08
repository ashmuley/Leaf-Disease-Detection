const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
exports.detectDisease = async (req, res) => {
    try {
        const form = new FormData();
        req.files.forEach(file => {
            form.append("files", fs.createReadStream(file.path));
        });
        const response = await axios.post(
            "http://127.0.0.1:8000/predict",
            form,
            { headers: form.getHeaders() }
        );
        req.files.forEach(file => fs.unlinkSync(file.path));
        let responseData = response.data;
        if (responseData.success && responseData.prescription) {
            const pres = responseData.prescription;
            const confidence = responseData.ai_prediction.confidence;
            const userName = req.body.userName || "Farmer";
            responseData.ai_greeting = `Thank you for your patience ${userName}. Based on my analysis, your ${pres.crop} is diagnosed with ${pres.disease} with ${confidence}% confidence. Here are my suggestions for you:`;
            for (const key in pres) {
                const val = pres[key];
                if (val === "N/A" || val === "None" || val === "none") {
                    delete pres[key];
                }
            }
            if (pres.treatment) {
                for (const key in pres.treatment) {
                    const val = pres.treatment[key];
                    if (val === "N/A" || val === "None" || val === "none") {
                        delete pres.treatment[key];
                    }
                }

                if (Object.keys(pres.treatment).length === 0 || !pres.treatment.pesticide) {
                    delete pres.treatment;
                }
            }
        }
        res.json(responseData);

    } catch (error) {
        if (req.files) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            });
        }

        console.error(error);
        res.status(500).json({
            success: false,
            message: "Disease detection failed"
        });
    }
};