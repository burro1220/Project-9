const express = require('express');
const router = express.Router();
const Course = require("../models").Course;
const User = require("../models").User;
const authenticate = require('./login');


//GET list of Courses
router.get('/', (req, res) => {
    Course.findAll({

         // Send only specific attributes
        attributes: [
            "id",
            "title",
            "description",
            "estimatedTime",
            "materialsNeeded",
            "userId"
      ],
      // Include the User's information in the query
      include: [
        {
          model: User,

          //Only send required attributes
          attributes: ["id", "firstName", "lastName", "emailAddress"]
        }
      ]
    }).then(courses => {

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
         // only send needed attributes
        attributes: [
            "id",
            "title",
            "description",
            "estimatedTime",
            "materialsNeeded",
            "userId"
      ],
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "emailAddress"]
        }
      ]
    }).then( course => {
        if(course) {

            //Attach Course list to response
            res.json(course);

            //Set 200 Status Code
            res.status(200);  

        } else {

            //Send error
            const err = new Error('There is no course by that id');
            err.status = 400;
            next(err);
        }
    });
})

// POST Create Course
router.post("/", authenticate, (req, res, next) => {
    
    //Grab info from request
    const info = req.body;
    
    //If title is undefined 
    if (!info.title) {
        const err = new Error('You have not entered a title for your course');
        err.status = 400;
        next(err);
       
    } else {
        //Look for prexisting Course
        Course.findOne({ where: { 
                title: info.title 
            }})
            .then( title => {

                //if course already exists
                if (title) {

                    //Send error
                    const err = new Error('This course already exists');
                    err.status = 400;
                    next(err);
                    
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
        })

    }

});

//PUT an update to a Course
router.put('/:id', authenticate, (req, res, next) => {

    //Grab info from request
    const info = req.body; 

        //Filter for Course by ID
        Course.findOne({ where: {
            id: info.id
        }})
        .then ( course => {
            
            //console.log(`userId= ${course.userId} id = ${req.currentUser.id}`);
            //If user doesn't own course
            if (course.userId !== req.currentUser.id) {

                //Send error
                const err = new Error('You can only edit your own course');
                err.statue = 403;
                next(err);
                
            } else if (course) {
                
                //Update Course
                course.update(info);

            } else {
                
                //Send error
                const err = new Error('We can not find a Course by that ID');
                err.status = 400;
                next(err);
            }
        })
        .then( () => {
            
            //On Success
            console.log("Your course has been edited");
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

        //Filter for Course by ID
        Course.findOne({ where: {
            id: info.id
        }})
        .then ( course => {

            //If user doesn't own course
            if (course.userId !== req.currentUser.id) {

                //Send error
                const err = new Error('You can only delete your own course');
                err.statue = 403;
                next(err);
                
            } else if (course) {
                
                //Delete Course
                course.destroy();

            } else {
                
                //Send error
                const err = new Error('We can not find a Course by that ID');
                err.status = 400;
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