const express = require("express")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const app = express();
app.use(bodyParser.json());
morgan.token('body', function(req, res) {return JSON.stringify(req.body)})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));


let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    }, {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    }, {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    }, {
        name: "mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]

app.get("/info", (req, res) => {
    const date = new Date();
    res.send(`<div>Phonebook has info for ${persons.length} people</div><div>${date.toString()}</div>`)
})

app.get("/api/persons/", (req, res) => {
    res.json(persons);
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(p => p.id !== id);
    console.log(`Person deleted (${id})`);
    res.status(204).end();
})

app.post("/api/persons", (req, res) => {
    const body = req.body;
    const id = Math.floor(Math.random() * Math.floor(2000));

    if (!body.name) {
        return res.status(400).json({error: "Name is missing"})
    } else if (!body.number) {
        return res.status(400).json({error: "Number is missing"})
    }

    const person = {
        name: body.name,
        number: body.number,
        id: id
    }

    persons = persons.concat(person);
    res.json(person);
})

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})