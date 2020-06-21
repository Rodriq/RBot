const express = require('express')
const app = express()
    // const request = require('request');
const axios = require('axios');
const { response } = require('express');

//set the template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))


//routes
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/page', (req, res) => {
    res.render('page')
})

//Listen on port 3000
server = app.listen(3000)



//socket.io instantiation
const io = require("socket.io")(server)


//listen on every connection
io.on('connection', (socket) => {
    console.log('New user connected')

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        console.log(data.message);

        var message = data.message.trim();
        // var msgStartsWith = message.replace(/ .*/, '').toLowerCase();
        var msgToArray = message.split(' ');
        var msgStartsWith = msgToArray.shift().toLowerCase();
        var remainingText = msgToArray.join().replace(',', ' ');

        if (msgStartsWith == 'photo' || msgStartsWith == 'picture' || msgStartsWith == 'image') {
            // url = getPhoto(remainingText);
            io.sockets.emit('new_image', { url: `https://source.unsplash.com/1600x900/?${remainingText}` })

        } else if (msgStartsWith == 'corona' || msgStartsWith == 'covid-19' || msgStartsWith == 'virus') {
            getCoronaStats(msgToArray[0], msgToArray[1])
        } else if (msgStartsWith == 'help') {
            io.sockets.emit('help', { message: "help" });
        } else {
            io.sockets.emit('no_query', { message: "Query not understood" });
        }

        console.log(msgStartsWith)


        // io.sockets.emit('new_message', { message: data.message, username: socket.username });
    })
})

var getPhoto = (word) => {

    axios.get(`https://source.unsplash.com/1600x900/?${word}`)
        .then(response => {
            var url = response.data.url;
            // console.log(url);
            // console.log("===========================================\n")
            // console.log(response.data.url);
            // console.log(response.data.explanation);
            return url;
        })
        .catch(error => {
            console.log(error);
        });

};

var getCoronaStats = (status, country) => {
    // console.log(status, country, "=====*********************************===========")
    axios.get(`https://covid1910.p.rapidapi.com/data/${status}/country/${country}`, {
        headers: {
            "x-rapidapi-host": "covid1910.p.rapidapi.com",
            "x-rapidapi-key": "d791374ee2mshc0ca27b5319d57fp1d7ac4jsncb7f92a90bce",
            "useQueryString": true
        }
    }).then(response => {
        console.log(response.data);
        io.sockets.emit('virus_info', { result: response.data })
        return (response.data)
    });
}