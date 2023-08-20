import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
  TextField,
} from "@material-ui/core";

import useStyles from "./styles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

const FirstPage: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (firstName && lastName && phone && email) {
      // Save user details to local storage
      localStorage.setItem(
        "userDetails",
        JSON.stringify({ firstName, lastName, phone, email })
      );

      // Redirect to the second page
      navigate("/details");
    } else {
      alert("Please fill in all the fields before submitting.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5">Sign Up</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <>
              <Grid item xs={12} sm={12} style={{ display: "flex" }}>
                <TextField
                  label="First Name"
                  value={firstName}
                  margin="normal"
                  variant="outlined"
                  autoFocus
                  onChange={(e) => setFirstName(e.target.value)}
                  fullWidth
                  style={{ paddingRight: "20px", width: "400px" }}
                  required
                />
                <TextField
                  label="Last Name"
                  value={lastName}
                  margin="normal"
                  variant="outlined"
                  onChange={(e) => setLastName(e.target.value)}
                  fullWidth
                  style={{ paddingRight: "20px", width: "400px" }}
                  required
                />
              </Grid>
            </>

            <Grid item xs={12} sm={12}>
              <TextField
                label="Phone number"
                value={phone}
                variant="outlined"
                onChange={(e) => setPhone(e.target.value)}
                fullWidth
                margin="normal"
                required
                type="tel"
              />
              <TextField
                label="Email"
                value={email}
                variant="outlined"
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                required
                type="email"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default FirstPage;
