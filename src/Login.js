import { Button, Card, Grid } from "@mui/material";
import React from "react";
import { auth, provider } from "./firebase";
import "./Login.css";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

function Login() {
  const handleOnDragStart = (e) => e.preventDefault();

  const handleOnSlideChange = (e) => console.log("Slide has been changed");

  const signIn = () => {
    auth.signInWithPopup(provider).catch((error) => alert(error.message));
  };

  const userCards = [
    {
      image: "https://images.unsplash.com/photo-1461468611824-46457c0e11fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    },
    {
      image: "https://images.unsplash.com/photo-1598885159329-9377168ac375?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2073&q=80",
    },
    {
      image: "https://images.unsplash.com/photo-1576671081837-49000212a370?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1998&q=80",
    },
  ];

  const responsive = {
    0: {
      items: 1,
    },
    600: {
      items: 2,
    },
    1024: {
      items: 3,
    },
  };

  return (
    <Grid container justifyContent="center" alignItems="center" height="100%">
      <Grid item xs={12} sm={12}>
        <Card sx={{ p: 2 }}>
          <div className="login__logo">
            <img
              id="logo"
              src="https://img.freepik.com/free-icon/chat_318-537201.jpg?w=2000"
              alt=""
              onDragStart={handleOnDragStart}
            />
            <span>Cancer Discussion Portal</span>
          </div>
          <AliceCarousel
            autoPlay
            autoPlayInterval={3000}
            animationType="fadeout"
            animationDuration={1000}
            disableDotsControls
            infinite
            responsive={responsive}
            onSlideChanged={handleOnSlideChange}
          >
            {userCards.map((card, index) => (
              <div key={index}>
                <Card sx={{ maxWidth: 1200, m: 2 }}>
                  <img
                    src={card.image}
                    alt=""
                    style={{ height: 400, objectFit: "cover" }}
                  />
                </Card>
              </div>
            ))}
          </AliceCarousel>
          <Button onClick={signIn}>Sign In</Button>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Login;
