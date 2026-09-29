import React from 'react';
import Hero from './components/Hero';
import Story from './components/Story';
import Couple from './components/Couple';
import Details from './components/Details';
import Countdown from './components/Countdown';
import FooterLinks from './components/FooterLinks';
import Footer from './components/Footer';
import GlobalAnimations from './components/GlobalAnimations';

function App() {
  return (
    <div className="app-container">
      <GlobalAnimations />
      <Hero />
      <Story />
      <Couple />
      <Details />
      <Countdown />
      <FooterLinks />
      <Footer />
    </div>
  );
}

export default App;
