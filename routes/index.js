const express = require("express");
const router = express.Router();

/**
 * @GET Returns the currently authenticated user
 */
router.get("/", (req, res) => {
  res.redirect("/api/users");
});

module.exports = router;