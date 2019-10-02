require('dotenv').config();
var nodemailer = require('nodemailer');
var fs = require('fs');
var arr = fs.readFileSync(`./${process.argv[2]}`).toString().split('\n');

var transporter = nodemailer.createTransport({
    service: `${process.env.SERVICE}`,
    auth: {
      user: `${process.env.EMAIL}`,
      pass: `${process.env.PASS}`
    }
});

var sendMail = function(mailoptions){
    return new Promise((res, rej)=> {
        transporter.sendMail(mailoptions, (err, info)=>{
            if(err){
                rej(err);
            }
            else{
                res();
            }
        })
    });
}

for(var i = 0; i < arr.length; i++) {
    var to = arr[i].split(",")[0];
    var name = arr[i].split(",")[1];
    var mailoptions = {
        from: `${process.env.EMAIL}`,
        to: `${to}`,
        subject: "Congratulations, Call for Interview!",
        html: `<p>Congratulations ${name}!\n\nYou have been selected for a in person interview on <b>10th September 2019, Tuesday<b>.</p><p><b>Venue: G9 Classroom<b>,<br><b>Time: 5 P.M.<b></p><p>Please be on time.</p><p>Kind Regards,<br>Team DSC</p>`
    }
    sendMail(mailoptions).then(()=>{
        console.log("Email Sent!");
    }).catch((err)=>{
        console.log(err);
    })
}