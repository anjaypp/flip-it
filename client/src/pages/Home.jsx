import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NewReleases from "../components/home/NewRelases";
import Books from "../components/home/Books";
import BrowseGenres from "../components/home/BrowseGenres";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (token) {
      // Save the token in localStorage
      localStorage.setItem("token", token);

      // Clean up the URL by removing the query parameter
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Redirect to login if token is not present or invalid
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        navigate("/login");
      }
    }
  }, [navigate]);

  return (
    <>
      <NewReleases />
      <Books />
      <BrowseGenres />
    </>
  );
}

export default Home;
