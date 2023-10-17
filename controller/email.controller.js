const transporter = require("../config/nodemailer");

const sendEmailNotification = async (req, res) => {
  try {
    const { email } = req.query;

    const info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: `${email}, ${email}`, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });

    res.json({ message: "Message sent: " + info.messageId });
  } catch (error) {
    res.json({ message: "Error", error: error.message });
  }
};

module.exports = { sendEmailNotification };
