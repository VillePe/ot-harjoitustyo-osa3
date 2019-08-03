const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("Give password as argument");
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://ot-harjoitustyo:${password}@cluster0-gcjjq.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })
.catch(error => {
    console.log("Error while connecting to database:", error);
    process.exit(1);
})

process.exit(0);

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person);
        })
        mongoose.connection.close();
    })
} else if (process.argv.length === 4) {
    console.log("Usage: password name number");
    process.exit(1);
} else {
    const name = process.argv[3];
    const number = process.argv[4];
    const person = new Person({
        name: name,
        number: number
    })
    person.save().then(response => {
        console.log(`Person ${name} saved into the database!`);
        mongoose.connection.close();
    })
}

// const note = new Note({
//     content: "HTML is easy",
//     date: new Date(),
//     important: true
// })

// note.save().then(response => {
//     console.log("Note saved!");
//     mongoose.connection.close();
// })