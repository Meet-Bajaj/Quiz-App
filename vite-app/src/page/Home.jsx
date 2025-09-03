import Prism from "./components/Prism";
import Navbar from "./components/NavAuth";
import Footer from "./components/Footer";
import { useNavigate } from 'react-router-dom';

function Home() {
  
  const attributes = {
    animationType: "rotate",
    timeScale: 0.5,
    height: 3.5,
    baseWidth: 5.5,
    scale: 3.6,
    hueShift: 0,
    colorFrequency: 1,
    noise: 0.5,
    glow: 1,
  };
  const navigate = useNavigate();

  return (
    <>
      <div className="h-screen w-screen relative flex  flex-col justify-center items-center gap-10 p-10">
        <Navbar />
        <div className="w-full h-full absolute -z-10 opacity-50 md:flex hidden">
          <Prism {...attributes} />
        </div>

        <h3 className="bricolage font-bold text-3xl w-full md:w-2/5 text-center">
          A Quiz platform to test knowledge, track progress, and compete via
          leaderboards and multiplayer challenges.
        </h3>
        <div className="flex justify-evenly w-96">
          <button className="bg-white text-black rounded-full font-medium px-8 py-2 hover:opacity-90" onClick={() => navigate('/signup')}>
            Get Started
          </button>
          <button className="py-2 px-8 bg-none border-2  text-white rounded-full font-medium hover:opacity-90">
            Learn More
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
