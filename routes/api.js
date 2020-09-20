const db = require("../models");

module.exports = function (app) {
    
    
    //Route to get all workouts
    app.get("/api/workouts", (req, res) => {
        db.Workout.find({}, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                res.json(data)
            }
        });
    });

    //Route to add exercise
    app.put("/api/workouts/:workout", ({ params, body }, res) => {
        db.Workout.findOneAndUpdate({ 
            _id: params.id},
            {
                $push: { exercises: body }},
                {upsert: true, useFindAndModify: false},
                updatedData => {
                    res.json(updatedData);
                })
    });

    //Route to add create new workout
    app.post("/api/workouts", (req, res) => {
        db.Workout.create({}).then(data => {
            res.json(data);
        });
    });

}