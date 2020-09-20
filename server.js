
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/fitness-tracker", {useNewUrlParser: true});


//API Routes

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
        

//HTML Routes

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/exercise.html"));
});

app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/stats.html"));

});


app.listen(PORT, () => {
    console.log(`App running on port ${PORT}..`);
})