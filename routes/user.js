const express = require('express');
const router = express.Router();
const User = require("../models").User;
const { sequelize } = require("../models");

router.get("/",(req, res) => {
    res.json({
      id: req.currentUser.id,
      firstName: req.currentUser.emailAddress,
      lastName: req.currentUser.lastName,
      emailAddress: req.currentUser.emailAddress
    });
    res.status(200);
  });