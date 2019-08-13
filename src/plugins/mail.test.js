const mail = require("./mail");

test("sendMail fails without configured transport", async () => {
  let rejected = false;
  try {
    mail
      .sendMail("test@demo.com", "from@demo.com", "Test subject", "Expired.")
      .catch(e => (rejected = true));
  } catch (e) {
    expect(rejected).toBe(true);
  }
});

test("sendMail uses configured transport", async () => {
  let options = {};
  mail.configureMailTransport(
    (to, from, subject, msgText, cc, bcc, attachments) => {
      options.from = from;
      options.to = to;
      options.subject = subject;
    }
  );
  try {
    mail.sendMail("test@demo.com", "from@demo.com", "Test subject", "Expired.");
  } catch (e) {
    expect(options.to).toBe("test@demo.com");
    expect(options.from).toBe("from@demo.com");
    expect(options.subject).toBe("Test subject");
  }
});
