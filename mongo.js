const mongoose = require('mongoose')

if(process.argv.length<3){
    console.log('give password as argument')
    process.exit(1)
} else if(process.argv.length < 5) {
    console.log('Name and number are requiered')
    process.exit(1)
}

const password = process.argv[2]

const url=
    `mongodb+srv://fullstack:${password}@cluster0.ktngqdx.mongodb.net/phoneApp?retryWrites=true&w=majority`

    mongoose.set('strictQuery', false)
    mongoose.connect(url)

    const phoneSchema = new mongoose.Schema({
        name: String,
        number: String,
    })

    const Phone =  mongoose.model('Phone', phoneSchema)

    const phone = new Phone({
        name: process.argv[3],
        number: process.argv[4]
    })

    /*
    phone
    .save()
    .then(response => {
        console.log('Contact saved!')
        mongoose.connection.close()
    })*/

    
    Phone
    .find({ name: process.argv[3], number: process.argv[4] })
    .then(phones => {
        phones
        .forEach(element => {
            console.log(element)
        })
        mongoose.connection.close()
    })