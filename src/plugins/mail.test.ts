import * as mail from './mail';

describe('plugins.mail', () => {
    describe('setImplementation', () => {
        test('causes functionality to fails without a configured transport', async () => {
            await expect(
                mail.sendMail('test@demo.com', 'from@demo.com', 'Test subject', 'Expired.'),
            ).rejects.toThrow();
        });

        test('only accepts valid implementations', async () => {
            expect(() =>
                mail.setImplementation({
                    x: true,
                }),
            ).toThrow();
            expect(
                mail.setImplementation({
                    sendEmail: jest.fn(),
                }),
            ).toBe(undefined);
        });
    });

    test('sendMail uses configured transport', async () => {
        const mailTransport = {
            sendEmail: jest.fn(() => true),
        };
        mail.setImplementation(mailTransport);
        await expect(
            mail.sendMail('test@demo.com', 'from@demo.com', 'Test subject', 'Expired.'),
        ).resolves.toBe(true);
        expect(mailTransport.sendEmail).toHaveBeenCalledWith(
            'test@demo.com',
            'from@demo.com',
            'Test subject',
            'Expired.',
            undefined,
            undefined,
            undefined,
            undefined,
        );
    });
});
