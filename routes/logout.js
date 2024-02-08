import express from "express";
import session from "express-session";

const logoutRouter = express.Router();

logoutRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.redirect("/welcome.html");
    }
  });
});

export default logoutRouter;
