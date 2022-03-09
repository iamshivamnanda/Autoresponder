const nodeMailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { userInfo } = require("os");

const Ticket = require("../model/ticket");

const transporter = nodeMailer.createTransport(
    sendgridTransport({
        auth: {
            api_key:
                "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 ",
        },
    })
);

exports.getCharBox =(req,res,next)=>{
    res.render('chatbox');
}
exports.bookTicket =(req,res,next)=>{
    console.log("BOOKE TICKET");
    const ticket = new Ticket({
        name:req.body.name,
        email:req.body.email
    });
    ticket.save().then(()=>{
        res.render("sucess");
            return transporter.sendMail({
                to: req.body.email,
                from: "iamshivamnanda@gmail.com",
                subject: "Ticket Booked",
                html: "<h1>You Ticket Is Booked</h1>",
            });
    }).catch(err=>{
        return next(err);
    })
}
function extractEmails ( text ){
    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
}

exports.message  =(req,res,next)=>{
    console.log("Message Recived");
    let responseData;
    const mymssg = "check ticket status for ";
    const confirmTick = "send ticket confirmation mail for ";
    console.log(req.body);
    if(!req.body.mssg){
        responseData ={
            message:"I am confused"
        }
        return res.end(JSON.stringify(responseData));
    }
    if(req.body.mssg.includes(mymssg)){
        responseData ={
            message:"Ticket is Booked"
        }
        return res.end(JSON.stringify(responseData));
    }
    if(req.body.mssg.includes(confirmTick)){
        let mail = extractEmails(req.body.mssg);
        transporter.sendMail({
            to: mail,
            from: "iamshivamnanda@gmail.com",
            subject: "Confirmation For Ticket Status",
            html: "<h1>You Ticket Is Booked</h1>",
        });
        responseData ={
            message:"confirmation Send"
        }

        return res.end(JSON.stringify(responseData));
    }
    responseData ={
        message:"I am confused"
    }
    return res.end(JSON.stringify(responseData));
};