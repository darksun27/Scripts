var MailListener = require("mail-listener2");
var { exec }         = require("child_process");
var mailListener = new MailListener({
  username: "sbsiddharth@gmail.com",
  password: "hsknstozkpnikjiu",
  host: "imap.gmail.com",
  port: 993, 
  tls: true,
  connTimeout: 10000, 
  authTimeout: 5000,
  debug: console.log, 
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX",
  searchFilter: ["UNSEEN"], 
  markSeen: true, 
  fetchUnreadOnStart: true, 
  mailParserOptions: {streamAttachments: true}, 
  attachments: true, 
  attachmentOptions: { directory: "attachments/" } 
});
 
mailListener.start(); // start listening

mailListener.on("mail", function(mail, seqno, attributes){
  console.log("emailParsed", mail.from[0].address);
  exec(`notify-send -i icon "New E-Mail" "New e-mail received from ${mail.from[0].address}"`,(error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
  });
});