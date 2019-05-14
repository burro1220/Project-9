const express = require('express');
const router = express.Router();
const Course = require("../models").Course;
const authenticate = require('./login');
const Sequelize = require('sequelize');

router.get('/', (req, res) => {
  res.status(200);
});

// POST Create User
router.post("/", (req, res, next) => {
    const info = req.body;
    Course.findOne({ where: { title: info.title }})
        .then( title => {
            if (title) {
                res.json({ error: "This course already exists"});
                res.status(400);
            } else {
                const newCourseInfo = {
                    title: info.title,
                    description: info.description,
                    estimatedTime: info.estimatedTime,
                    materialsNeeded: info.materialsNeeded
                };
           
            //Create Course
            Course.create(newCourseInfo)
            .then(() => {
                res.status(201).end();
            })
            //Catch error and check if Sequelize validation  error (not using) and pass error to next middleware
            // .catch (err => {
            //     if (err.name === "SequelizeValidationError") {
            //         err.message = "All data must be entered";
            //         err.status = 400;
            //     } else {
            //         err.status = 400;
            //         next(err);
            //     }
            // });
        
        }
    }
)});





module.exports = router;