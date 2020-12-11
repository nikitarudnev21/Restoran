const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
app.use(express.json({ extended: true })); 

app.use('/api/auth', require('./controllers/authController'));
app.use('/api/apikey', require('./controllers/apikeyController'));
app.use('/api/restaraunt', require('./controllers/restarauntController'));
app.use('/api/users', require('./controllers/usersController'));

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')); 
    }); 

}

const PORT = config.get('port') || 3002;

const start = async () => {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`));
    } catch (e) {
        console.log('Server error', e.message);
        process.exit(1);
    }
};
start();