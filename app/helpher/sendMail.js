var nodemailer = require('nodemailer');

const emailVerification = (email, code) => {
	const mailOptions = {
		from: process.env.FROM, // sender address
		to: email, // list of receivers
		subject: 'Email Verification', // Subject line
		html:
			`<p>Please use the link below to sign up</p>` +
			`
    ${process.env.FRONT_END_URL}/update-password/?token=${code}`,
	};
	return mailOptions;
};

const emailForgotPassword = (email, code, firstName, lastName) => {
	console.log(email, code, firstName, lastName);
	const mailOptions = {
		from: process.env.FROM, // sender address
		to: email, // list of receivers
		subject: 'Password Reset Link', // Subject line
		html: `<p> Hello ${firstName || ''} ${lastName || ''},</p>
		<p>Someone (hopefully you!) has requested to change your Xana account password. Please use the code below to change your password now.<br>
		Your email verification code is <b>${code}</b>. <br>
		If you didn't make this request, please disregard this email. Please note that your password will not change unless you use the code above and create a new one.<br>
		If you've requested multiple reset emails, please make sure you use the code inside the most recent email.
		</p>`,
	};
	return mailOptions;
};
const codeResend = (email, code) => {
	const mailOptions = {
		from: process.env.FROM, // sender address
		to: email, // list of receivers
		subject: 'Password Reset Link', // Subject line
		html: `<p>Your new email verification code is ${code}</p>`, // plain text body
	};
	return mailOptions;
};
function sendEmail(email, code, flag, firstName, lastname) {
	console.log(flag);
	const transporter = nodemailer.createTransport({
		// host: process.env.HOST,
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: process.env.FROM,
			pass: process.env.PASSWORD,
		},
	});
	const mailOptions =
		flag == 1
			? emailVerification(email, code)
			: flag == 2
			? emailForgotPassword(email, code, firstName, lastname)
			: flag == 3
			? codeResend(email, code)
			: '';
	transporter.sendMail(mailOptions, function (err, info) {
		if (err) {
			console.log(err);
			return new Error('Something went wrong', err);
		} else {
			console.log(info);
			return info;
		}
	});
}

module.exports = sendEmail;
