const express = require("express");
const bodyParser = require("body-parser")
const app = express();

app.use(bodyParser.json());

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2019-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2019-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2019-05-30T19:20:14.298Z",
        important: true
    }
]

app.get("/", (req, res) => {
    res.send("<h1>HELLO WORLD</h1>");
})

app.get("/notes", (req, res) => {    
    res.json(notes);
})

app.get("/notes/:id", (req, res) => {
    const id = Number(req.params.id);
    const note = notes.find(note => note.id === id);
    if (note) {
        res.json(note);
    } else {
        res.status(404).end();
    }
})

app.delete("/notes/:id", (req, res) => {
    const id = Number(req.params.id);
    console.log("DELETE");
    notes = notes.filter(n => {
        return n.id !== id
    });
    notes.forEach(n => console.log(n))
    res.status(204).end();
})

app.post("/notes", (req, res) => {
    const body = req.body;

    if (!body.content) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        id: generateId(),
        content: body.content,
        date: new Date(),
        important: body.important || false
    }
    console.log("NOTE:",note);
    notes = notes.concat(note);
    res.json(note);
})

const generateId = () => {
    const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
    return maxId+1;
}

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})