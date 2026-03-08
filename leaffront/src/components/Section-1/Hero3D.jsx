import Spline from "@splinetool/react-spline";

function Hero3D() {
  return (
    <div className="spline-container">
      {/* <Spline  scene="https://prod.spline.design/2d1NRljwo2hx0jlF/scene.splinecode" 
      /> */}
      <Spline
        scene="https://prod.spline.design/2d1NRljwo2hx0jlF/scene.splinecode"
        //  scene="https://prod.spline.design/phvgO5TUzxVLnUYe/scene.splinecode" 

        onLoad={(spline) => console.log("Spline loaded")}
      />

    </div>
  );
}

export default Hero3D;
{/* <script type="module" src="https://unpkg.com/@splinetool/viewer@1.12.58/build/spline-viewer.js"></script>
<spline-viewer url="https://prod.spline.design/2d1NRljwo2hx0jlF/scene.splinecode"></spline-viewer> */}

{/* <script type="module" src="https://unpkg.com/@splinetool/viewer@1.12.58/build/spline-viewer.js"></script>
<spline-viewer url="https://prod.spline.design/2d1NRljwo2hx0jlF/scene.splinecode"></spline-viewer> */}

// "https://prod.spline.design/8sJ0K6Wpqn5q5SdM/scene.splinecode"