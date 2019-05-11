const express = require('express');
const router = express.Router();
const User = require("../db/models").User;
const Sequelize = require("sequelize");

router.get('/', (req, res) => {
    console.log(req)
    })