require("dotenv").config();
const express = require("express")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const Person = require("./models/person")

const app = express();
app.use(bodyParser.json());
app.use(express.static("build"));
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

app.get("/info", (req, res) => {
    Person.find({}).then(persons => {
        const date = new Date();
        res.send(`<div>Phonebook has info for ${persons.length} people</div><div>${date.toString()}</div>`)
    })
})

app.get("/api/persons/", (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons);
    })
})

app.get("/api/persons/:id", (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person.toJSON());
            } else {
                res.status(404).end();
            }
        })
        .catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(person => {
            console.log("Person deleted");
            res.json(person.toJSON());
        })
        .catch(error => next(error))
})

app.post("/api/persons", (req, res) => {
    const body = req.body;

    if (!body.name) {
        return res.status(400).json({ error: "Name is missing" })
    } else if (!body.number) {
        return res.status(400).json({ error: "Number is missing" })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save()
        .then(savedPerson => {
            res.json(savedPerson.toJSON());
            console.log("Person added!");
        })
        .catch(error => {
            console.log("Error while adding person:", error.message);
            res.status(500).end();
        })
})

app.put("/api/persons/:id", (req, res, next) => {
    const body = req.body;
    const id = {id: body.id};

    const person = {
        id: id,
        name: body.name,
        number: body.number
    }

    console.log(person);

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            console.log(updatedPerson.toJSON());
            res.json(updatedPerson.toJSON());
        })
        .catch(error => next(error));

})

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})

const errorHandler = (error, req, res, next) => {
    console.error("Error:", error.message);
    if (error.name === "CastError" && error.kind == "ObjectId") {
        return res.status(400).send({ error: "Malformatted id" });
    }

    next(error);
}
app.use(errorHandler);