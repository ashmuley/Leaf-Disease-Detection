import { useLocation } from "react-router-dom";
import ResultDisplay from "./ResultDisplay";
import "./ResultPage.css";

function ResultPage() {

    const location = useLocation();
    const { result, images } = location.state || {};

    if (!result) {
        return <h2>No result found</h2>;
    }

    return (
        <div className="result-page">

            <h2>Detection Result</h2>

            {/* Uploaded Images */}
            <div className="result-images">
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={URL.createObjectURL(img)}
                        alt="leaf"
                        className="result-img"
                    />
                ))}
            </div>

            {/* AI Result */}
            <ResultDisplay result={result} />

        </div>
    );
}

export default ResultPage;