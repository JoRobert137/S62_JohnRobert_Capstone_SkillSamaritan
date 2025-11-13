import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import TaskFeed from "../components/TaskFeed";
import Footer from "../components/Footer";

function LandingPage() {
  return (
    <>
      <Header />
      <HeroSection />
      <TaskFeed />
      <Footer /> 
    </>
  );
}

export default LandingPage;
