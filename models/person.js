const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

const censoredUrl = () => {
    let foundColonCount = 0;
    let passwdColongIndex = 0;
    let passwdLength = 0;
    let atMarkIndex = 0;
    for (let i = 0; i < url.length; i++) {        
        if (url[i] == ":") {
            foundColonCount += 1;
            if (foundColonCount == 2) {
                passwdColongIndex = i;                
            }
        }
        if (foundColonCount == 2 && url[i] == "@") {
            passwdLength = i - passwdColongIndex;
            atMarkIndex = i;
            break;
        }
    }

    let result = url.substr(0, passwdColongIndex+1) + "*****" + url.substr(passwdColongIndex+passwdLength, url.length - atMarkIndex);
    return result;
}

console.log("Connecting to", censoredUrl());

mongoose.connect(url, { useNewUrlParser: true })
    .then(result => {
        console.log("Connected to MongoDB");
    })
    .catch(error => {
        console.log("Error connecting to MongoDB:", error.message);
    });

const personSchema = new mongoose.Schema({    
    name: String,
    number: String
})

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model("Person", personSchema);

module.exports = mongoose.model("Person", personSchema);