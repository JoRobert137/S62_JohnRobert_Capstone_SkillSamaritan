import React from "react";
import { Link } from "react-router-dom";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";
import TaskFeed from "./components/TaskFeed";
import Footer from "./components/Footer";
import Testimonials from "./components/Testimonials";

function LandingPage() {
  return (
    <>
    <Header />
      <HeroSection />
      <StatsSection />
      <TaskFeed />
      <Testimonials />
      <Footer /> 
    </>
  );
}

export default LandingPage;
