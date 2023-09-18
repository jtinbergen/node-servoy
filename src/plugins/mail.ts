type MailTransporter = {
    sendEmail?: any;
    x?: boolean;
};

let implementation: MailTransporter;

const setImplementation = (mailTransporter: MailTransporter) => {
    if (!mailTransporter.sendEmail || typeof mailTransporter.sendEmail !== 'function') {
        throw new Error('Not a valid implementation');
    }

    implementation = mailTransporter;
};

const createBinaryAttachment = (filename: string, data: any) => ({
    filename,
    content: Buffer.from(data),
});

const sendMail = async (
    to: string,
    from: string,
    subject: string,
    msgText: string,
    cc?: string,
    bcc?: string,
    attachments?: any[],
    overrideProperties?: boolean,
) => {
    if (!implementation) {
        throw new Error('No email transport defined yet. Unable to send mail.');
    }

    return implementation.sendEmail(
        to,
        from,
        subject,
        msgText,
        cc,
        bcc,
        attachments,
        overrideProperties,
    );
};

const sendBulkMail = sendMail;

const receiveMail = (
    username: any,
    password: any,
    leaveMsgsOnServer: any,
    receiveMode: any,
    onlyReceiveMsgWithSentDate: any,
    properties: any,
) => {
    throw new Error('Not implemented');
};

const isValidEmailAddress = (email: string) =>
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email,
    );

const getPlainMailAddresses = (addressesString: string) => {
    throw new Error('Not implemented');
};

const getLastSendMailExceptionMsg = () => {
    throw new Error('Not implemented');
};

const getMailMessage = (binaryblobOrString: Buffer | string) => {
    throw new Error('Not implemented');
};

export {
    setImplementation,
    createBinaryAttachment,
    sendMail,
    sendBulkMail,
    receiveMail,
    isValidEmailAddress,
    getPlainMailAddresses,
    getLastSendMailExceptionMsg,
    getMailMessage,
};
