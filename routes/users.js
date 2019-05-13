const express = require('express');
const router = express.Router();
const User = require("../models").User;
const authenticate = require('./login');


//GET current authorized User
router.get("/", authenticate, (req, res) => {
    console.log(req);
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
               User.create({
                   emailAddress: info.emailAddress,
                   firstName: info.firstName,
                   lastName: info.lastName,
                   password: info.password
               });
               res.status(201).end();
            }
        })
        .catch (err => {
            if (err.name === "SequelizeValidationError") {
                err.message = "All data must be entered";
                err.status = 400;
            } else {
                next(err);
            }
        })

})

module.exports = router;