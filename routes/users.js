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
        
    //If email address is undefined 
    if (!info.emailAddress) {
        const err = new Error('You have not entered sufficient credentials');
        err.status = 400;
        next(err);

    } else {

        User.findOne({ where: { emailAddress: info.emailAddress }})
        .then( email => {
            
            //If email already exists
            if (email) {

                const err = new Error('That email address is already in use');
                err.status = 400;
                next(err);

            } else {

               //If Email Is Valid
                    //Hash Password
                    info.password = bcryptjs.hashSync(info.password);                

                    //Create user
                    User.create(info)
                    .then(() => {
                        res.location('/');
                        res.status(201).end();
                    })
                    //Catch error and check if Sequelize validation  error (not using) and pass error to next middleware
                    .catch (err => {
                        if (err.name === "SequelizeValidationError") {
                            err.message = "All data must be entered";
                            err.status = 400;
                            next(err);
                        } else {
                            err.status = 400;
                            next(err);
                        }
                    });
                } 
    });
        
  }   

});

module.exports = router;