const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');
const mongoose = require('mongoose');



const errorController = require('./controller/error');
const chatController = require('./controller/chat');
const homeController = require('./controller/home');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/',homeController.getIndex);
app.get("/chatbox",chatController.getCharBox);
app.post("/api/chatmessage/",chatController.message);
app.post("/bookticket",chatController.bookTicket);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
  });
});

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uq80n.mongodb.net/ww-prod?retryWrites=true&w=majority`).then(()=>{
  app.listen(process.env.PORT || 5000);
  console.log("Connected");
}).catch((err)=>{
  console.log(err);
});