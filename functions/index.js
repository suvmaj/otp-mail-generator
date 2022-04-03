const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });
const { generate: generateOTP } = require('otp-generator');
admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '',
    pass: '',
  },
});

exports.firebaseOTP = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const dest = req.query.dest;
    if (dest) {
      const otp = generateOTP(4, { specialChars: false, alphabets: false });
      const mailOptions = {
        from: '',
        to: dest,
        subject: 'VERIFICATION CODE',
        html: `<p style="font-size: 16px;">Your Verification Code is ${otp}</p>`,
      };

      return transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
          return res.send(err.toString());
        }
        return res.send({ msg: 'OTP sent successfully', otp });
      });
    }
    return res.send('Error! No email provided.');
  });
});
