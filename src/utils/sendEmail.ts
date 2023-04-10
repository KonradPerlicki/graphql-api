import nodemailer from "nodemailer";
import { v4 } from "uuid";
import { confirmationPrefix } from "../constants";
import { cache } from "../cache";
import logger from "./logger";

export enum Subject {
    REGISTER = "Welcome to our system",
    DELETION = "Your account has been deleted",
}

export async function sendEmail(email: string, userId: string, subjectType: Subject) {
    const testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    const token = generateToken(userId);

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Konrad Perlicki" <konrad.perlicki01@gmail.com>', // sender address
        to: email, // list of receivers
        subject: subjectType, // Subject line
        html: generateHtmlDesc(subjectType, token), // html body
    });

    // Preview only available when sending through an Ethereal account
    logger.info("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return String(nodemailer.getTestMessageUrl(info));
}

export const generateToken = (userId: string) => {
    const token = v4();

    cache.set(confirmationPrefix + token, userId, 60 * 60 * 24);
    return token;
};

const generateHtmlDesc = (subjectType: Subject, token: string) => {
    if (subjectType === Subject.REGISTER) {
        return `Welcome to our system! You have successfully created account. Last thing you have to do is confirm your email with token:${token}`;
    }

    return ``;
};
