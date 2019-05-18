const express = require('express');
const router = express.Router();
const Course = require("../models").Course;
const authenticate = require('./login');


//GET list of Courses
router.get('/', (req, res) => {
    Course.findAll().then(courses => {

        //Attach Course list to response
        res.json(courses);

        //Set 200 Status Code
        res.status(200);
    }).catch(err => {

        if (err.name === "SequelizeValidationError") {
            err.message = "All data must be entered";
            err.status = 400;
        } else {
            err.status = 400;
            next(err);
        }
    }); 
});

//GET Course by ID
router.get('/:id', (req, res, next) => {
    
    //Grab info from request
    const info = req.params;
    
    //Filter for course
    Course.findOne({
        where: {
            id: info.id
        },
    }).then( course => {
        if(course) {

            //Attach Course list to response
            res.json(course);

            //Set 200 Status Code
            res.status(200);  
        } else {
            //Send error
            err.status(400);
            res.json({ error: "There is no course by that id"});
            next(err);
        }
    });
})

// POST Create Course
router.post("/", authenticate, (req, res, next) => {
    
    //Grab info from request
    const info = req.body; 

    //Look for prexisting Course
    Course.findOne({ where: { 
            title: info.title 
        }})
        .then( title => {
            if (title) {

                //Send error
                res.json({ error: "This course already exists"});
                res.status(400);
            } else {

             //Set foreign key
             info.userId = req.currentUser.id;              
            
             //Create Course
            Course.create(info)
            .then(() => {
                console.log("Your course has been created");
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

//PUT an update to a Course
router.put('/:id', authenticate, (req, res, next) => {

    //Grab info from request
    const info = req.body; 
        
    //Filter for Course by ID
    Course.findOne({ where: {
        id: info.id
    }})
    .then ( course => {
        if (course) {
            
            //Update Course
            course.update(info);

        } else {
            
            //Send error
            err.status(400);
            res.json({ error: "We can not find a Course by that ID" })
            next(err);
        }
    })
    .then( () => {
        
        //On Success
        console.log("Your course has been created");
        res.status(204).end();
    })
    .catch(err => {
        if (err.name === "SequelizeValidationError") {
            err.message = "All data must be entered";
            err.status = 400;
        } else {
            err.status = 400;
            next(err);
        } 
    })
});

//Delete a Course
router.delete('/:id', authenticate, (req, res, next) => {

    //Grab info from request
    const info = req.body; 
     console.log(info)  ;
    //Filter for Course by ID
    Course.findOne({ where: {
        id: info.id
    }})
    .then ( course => {
        if (course) {
            
            //Update Course
            course.destroy();

        } else {
            
            //Send error
            err.status(400);
            res.json({ error: "We can not find a Course by that ID" })
            next(err);
        }
    })
    .then( () => {
        
        //On Success
        console.log("Your course has been deleted");
        res.status(204).end();
    })
    .catch(err => {
        if (err.name === "SequelizeValidationError") {
            err.message = "All data must be entered";
            err.status = 400;
        } else {
            err.status = 400;
            next(err);
        } 
    })
});

module.exports = router;