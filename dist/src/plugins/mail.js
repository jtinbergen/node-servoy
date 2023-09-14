"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMailMessage = exports.getLastSendMailExceptionMsg = exports.getPlainMailAddresses = exports.isValidEmailAddress = exports.receiveMail = exports.sendBulkMail = exports.sendMail = exports.createBinaryAttachment = exports.setImplementation = void 0;
let implementation = null;
const setImplementation = (mailTransporter) => {
    if (!mailTransporter.sendEmail || typeof mailTransporter.sendEmail !== 'function') {
        throw new Error('Not a valid implementation');
    }
    implementation = mailTransporter;
};
exports.setImplementation = setImplementation;
const createBinaryAttachment = (filename, data) => ({
    filename,
    content: Buffer.from(data),
});
exports.createBinaryAttachment = createBinaryAttachment;
const sendMail = async (to, from, subject, msgText, cc, bcc, attachments, overrideProperties) => {
    if (!implementation) {
        throw new Error('No email transport defined yet. Unable to send mail.');
    }
    return implementation.sendEmail(to, from, subject, msgText, cc, bcc, attachments, overrideProperties);
};
exports.sendMail = sendMail;
const sendBulkMail = sendMail;
exports.sendBulkMail = sendBulkMail;
const receiveMail = (username, password, leaveMsgsOnServer, receiveMode, onlyReceiveMsgWithSentDate, properties) => {
    throw new Error('Not implemented');
};
exports.receiveMail = receiveMail;
const isValidEmailAddress = (email) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
exports.isValidEmailAddress = isValidEmailAddress;
const getPlainMailAddresses = (addressesString) => {
    throw new Error('Not implemented');
};
exports.getPlainMailAddresses = getPlainMailAddresses;
const getLastSendMailExceptionMsg = () => {
    throw new Error('Not implemented');
};
exports.getLastSendMailExceptionMsg = getLastSendMailExceptionMsg;
const getMailMessage = (binaryblobOrString) => {
    throw new Error('Not implemented');
};
exports.getMailMessage = getMailMessage;
//# sourceMappingURL=mail.js.map