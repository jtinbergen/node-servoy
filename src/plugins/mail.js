let transporter = null;

const configureMailTransport = (mailTransporter) => {
    transporter = mailTransporter;
};

const createBinaryAttachment = (filename, data) => ({
    filename,
    content: Buffer.from(data),
});

const sendMail = async (to, from, subject, msgText, cc, bcc, attachments) => {
    if (!transporter) {
        return Promise.reject('No email transport defined yet. Unable to send mail.');
    }

    return transporter(to, from, subject, msgText, cc, bcc, attachments);
};

module.exports = {
    configureMailTransport,
    createBinaryAttachment,
    sendMail,
};
