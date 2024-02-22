const mongoose = require('mongoose');

const connect = async () => {
    try {
        await mongoose.connect(`mongodb+srv://trungdang24:${process.env.MONGO_PASSWORD}@cluster0.uabz8cf.mongodb.net/demoDB`).then(() => {
            console.log('Connect successfully');
        })
    } catch (error) {
        console.log('Connect fail');
    }
}

module.exports = connect