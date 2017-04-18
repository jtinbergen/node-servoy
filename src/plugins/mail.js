const nodemailer = require('nodemailer');

let transporter = null;

const configureTransporter = () => {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'gmail.user@gmail.com',
            pass: 'yourpass',
        },
    });
};

const createBinaryAttachment = (filename, data) => ({
    filename,
    content: Buffer.from(data),
});

const sendMail = async (to, from, subject, msgText, cc, bcc, attachments) => {
    if (!transporter) {
        throw new Error('No email transport defined yet. Unable to send mail.');
    }

    const mailOptions = {
        from: from.split(',')[0],
        to,
        subject,
        cc,
        bcc,
        text: msgText.indexOf('html') === -1 ? msgText : null,
        html: msgText.indexOf('html') !== -1 ? msgText : null,
        attachments,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(info);
        });
    });
};

module.exports = {
    configureTransporter,
    createBinaryAttachment,
    sendMail,
};
