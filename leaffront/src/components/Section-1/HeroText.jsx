import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../../utils/auth";

function HeroText() {


            const navigate = useNavigate();

          const handleDetectClick = () => {
            // console.log("Button clicked")

           if (!isLoggedIn()) {
              alert("Please login first");
              navigate("/login");
              return;
            }

            // If logged in → allow action
            console.log("User is logged in. Continue...");
          };

          
  return (
    <>
      <h1 id="h1-l1" >AI-Powered </h1>
      <h1 id="h1-l2" className="h1-3" >Leaf Disease</h1>
      {/* <h1 id="h1-l4" className="h1-3">Disease</h1> */}
      <h1 id="h1-l3" className="h1-3">Detection</h1>
      <p>Upload a leaf image and detect plant diseases instantly.</p>
      <button type="button" onClick={handleDetectClick}>Detect Now</button>
    </>
  );
}

export default HeroText;