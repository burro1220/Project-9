const express = require('express');
const router = express.Router();
const User = require("../models").User;
const authenticate = require('./login');
const bcryptjs = require("bcryptjs");


//GET current authorized User
router.get("/", authenticate, (req, res) => {
    res.json({
      id: req.currentUser.id,
      firstName: req.currentUser.emailAddress,
      lastName: req.currentUser.lastName,
      emailAddress: req.currentUser.emailAddress
    });
    res.status(200);
});

// POST Create User
router.post("/", (req, res, next) => {
    const info = req.body;
    User.findOne({ where: { emailAddress: info.emailAddress }})
        .then( email => {
            if (email) {
                res.json({ error: "This email address is already in use"});
                res.status(400);
            } else {
                const newUserInfo = {
                    emailAddress: info.emailAddress,
                    firstName: info.firstName,
                    lastName: info.lastName,
                    password: info.password
                };
                
            //Hash Password
            newUserInfo.password = bcryptjs.hashSync(newUserInfo.password);                

            //Create user
            User.create(newUserInfo)
            .then(() => {
                res.status(201).end();
            })
            //Catch error and check if Sequelize validation  error (not using) and pass error to next middleware
            .catch (err => {
                if (err.name === "SequelizeValidationError") {
                    err.message = "All data must be entered";
                    err.status = 400;
                } else {
                    err.status = 400;
                    next(err);
                }
            });
        
        }
    }
)});

module.exports = router;