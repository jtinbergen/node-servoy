let implementation = null;

const setImplementation = (mailTransporter) => {
  if (!mailTransporter.sendEmail || !mailTransporter.sendEmail === 'function') {
    throw new Error('Not a valid implementation');
  }
  implementation = mailTransporter;
};

const createBinaryAttachment = (filename, data) => ({
  filename,
  content: Buffer.from(data),
});

const sendMail = async (
  to,
  from,
  subject,
  msgText,
  cc,
  bcc,
  attachments,
  overrideProperties,
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
  username,
  password,
  leaveMsgsOnServer,
  receiveMode,
  onlyReceiveMsgWithSentDate,
  properties,
) => {
  // Log message about not being implemented
};

const isValidEmailAddress = (email) =>
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email,
  );

const getPlainMailAddresses = (addressesString) => {
  //
};

const getLastSendMailExceptionMsg = () => {
  //
};

const getMailMessage = (binaryblobOrString) => {
  //
};

module.exports = {
  setImplementation,
  createBinaryAttachment,
  sendMail,
  sendBulkMail,
  receiveMail,
  isValidEmailAddress,
  getPlainMailAddresses,
};
