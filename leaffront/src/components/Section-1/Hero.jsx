import HeroText from "./HeroText";
import Hero3D from "./Hero3D";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-left">
        <HeroText />
      </div>

      <div className="hero-right">
        <Hero3D />
      </div>
    </section>
  );
}

export default Hero;