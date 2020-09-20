const db = require("../models");


module.exports = function (app) {

    // gets all workouts back
    app.get("/api/workouts", (req, res) => {
        var total = 0;
        // find all workouts in db (an array)
        db.Workout.find({}).then(Workoutdb => {
           // iterate through array for each workout and add up their time
            Workoutdb.forEach(workout => {
                workout.exercises.forEach(exercises => {
                    total += exercises.duration;
                });
                // set total workout time to the time we just added up
                workout.totalDuration = total;
            });
            //send json of all workouts back
            console.log(Workoutdb)
            res.json(Workoutdb);
        }).catch(err => {
            res.json(err);
        });
    });

    //get specific workout data back by id
    app.put("/api/workouts/:id", (req, res) => {
// id gets sent over in parameter fro client side javascript
        db.Workout.findOneAndUpdate(
            //filter
            { _id: req.params.id },
            //directions for mongoose to carry out
            {   //increments time
                $inc: { totalDuration: req.body.duration },
                // adds request body to excersises array
                $push: { exercises: req.body }
            },//ensures we are sending an updated object back
            //does not mean we "created a new object"
            { new: true }).then(Workoutdb => {
                //send updated object
                res.json(Workoutdb);
            }).catch(err => {
                res.json(err);
            });

    });

    //posting new workout to database
    app.post("/api/workouts", (req, res) => {
        // create new instance to add to our db
        db.Workout.create(req.body).then((Workoutdb => {
            res.json(Workoutdb);
        })).catch(err => {
            res.json(err);
        });
    });

    // get workouts in range
    app.get("/api/workouts/range", (req, res) => {
        //returns all of the db to the charts page
        db.Workout.find({}).then(Workoutdb => {

            res.json(Workoutdb);
        }).catch(err => {
            res.json(err);
        });

    });


}