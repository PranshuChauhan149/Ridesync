import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL;
const emailPassword = process.env.EMAIL_PASSWORD;

if (!emailUser || !emailPassword) {
    throw new Error(
        "Missing mail configuration: set EMAIL and EMAIL_PASSWORD in .env",
    );
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: emailUser,
        pass: emailPassword,
    },
});

export const sendMail = async (to: string, subject: string, html: string) => {
    try {
        await transporter.sendMail({
            from: `"RYDEX" <${emailUser}>`,
            to,
            subject,
            html,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown mail error";
        throw new Error(`Failed to send email: ${message}`);
    }
};