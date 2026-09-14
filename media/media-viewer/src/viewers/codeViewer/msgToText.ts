import MsgReader from '@kenjiuno/msgreader';

import { formatMessage } from './formatMessage';
import { getMsgDate } from './getMsgDate';

interface Recipient {
	name: string;
	email: string;
}

interface Attachment {
	fileName: string;
	mimeType?: string;
	contentLength: number;
	url?: string;
}

export function msgToText(buffer: ArrayBuffer):
	| string
	| {
			error: string | undefined;
	  } {
	try {
		const msgReader = new MsgReader(buffer);
		const msg = msgReader.getFileData();

		if (msg.error) {
			return { error: msg.error };
		}

		let text = '';

		if (msg.headers) {
			text += `\nDATE:\t\t${getMsgDate(msg.headers)}`;
		}

		if (msg.senderEmail || msg.senderName) {
			text += `\nFROM:\t\t${msg.senderName} <${msg.senderEmail}>`;
		}

		if (msg.recipients) {
			text += `\nTO:\t\t${(
				msg.recipients as Recipient[]
			) /* lib types are broken, need to override here */
				.map((recipient: Recipient) => `${recipient.name} <${recipient.email}>`)
				.join(', ')}`;
		}

		if (msg.subject) {
			text += `\nSUBJECT:\t${msg.subject}`;
		}

		if (msg.attachments) {
			const attachments = msg.attachments as Attachment[];
			text += `\nATTACHMENTS:\t${attachments
				.map(
					(attachment: Attachment) =>
						`<${attachment.fileName} (${attachment.contentLength} bytes)>`,
				)
				.join(', ')}`;
		}

		text = formatMessage(text);

		if (msg.body) {
			text += `\n${msg.body}`;
		}

		return text.trim();
	} catch (e) {
		return { error: e instanceof Error ? e.stack : '' };
	}
}
