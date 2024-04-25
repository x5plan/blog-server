import { Injectable } from "@nestjs/common";
import { renderFile } from "ejs";
import nodemailer from "nodemailer";
import { join } from "path";

import { MailSendErrorException } from "@/common/exception/mail-send-error.exception";
import { type CE_Language, getLanguage } from "@/common/locales";
import { ConfigService } from "@/config/config.service";

export const enum CE_MailTemplate {
    RegisterVerificationCode = "register-verification-code",
    ResetPasswordVerificationCode = "reset-password-verification-code",
    ChangeEmailVerificationCode = "change-email-verification-code",
}

@Injectable()
export class MailService {
    private readonly transporter: nodemailer.Transporter;

    constructor(private readonly configService: ConfigService) {
        this.transporter = nodemailer.createTransport(this.configService.config.mail.transport);
    }

    private async generateEmailAsync(
        template: CE_MailTemplate,
        lang: string,
        data: Record<string, string>,
    ): Promise<{
        subject: string;
        html: string;
    }> {
        const templateFile = join(__dirname, "templates", `${template}.${getLanguage(lang)}.ejs`);
        const renderResult = await renderFile(templateFile, {
            ...data,
            appName: this.configService.config.appName,
        });
        const [subject, ...bodyLines] = renderResult.trim().split("\n");
        const html = bodyLines.join("\n");

        return { subject, html };
    }

    /**
     * Send a template mail to an email address.
     *
     * @param template The template mail name
     * @param lang The language of the template
     * @param data The data to pass to the template
     * @param to The recipient email address
     * @returns The error message. Falsy on success.
     */
    public async sendMailAsync(
        template: CE_MailTemplate,
        lang: CE_Language,
        data: Record<string, string>,
        to: string,
    ): Promise<void> {
        try {
            const { subject, html } = await this.generateEmailAsync(template, lang, data);
            await this.transporter.sendMail({
                from: `${this.configService.config.appName} <${this.configService.config.mail.address}>`,
                to,
                subject,
                html,
            });
        } catch (e) {
            throw new MailSendErrorException(String(e));
        }
    }
}
