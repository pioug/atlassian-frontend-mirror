import MsgReader from '@kenjiuno/msgreader';

export function msgToText(buffer: ArrayBuffer) {
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
      text += `\nTO:\t\t${(msg.recipients as Recipient[]) /* lib types are broken, need to override here */
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
    return { error: e.stack };
  }
}

interface Recipient {
  name: string;
  email: string;
}

interface Attachment {
  fileName: string;
  mimeType?: string;
  contentLength: number;
  url: string;
}

export function formatMessage(text: string) {
  const lines = text.trim().split('\n');
  let maxLineLength = 0;
  lines.forEach(
    (line: string) => (maxLineLength = Math.max(line.length, maxLineLength)),
  );

  const border = '*'.repeat(maxLineLength + 10);
  text = `${border}\n`;
  text += lines.map((line: string) => ` ${line}`).join('\n');
  text += `\n${border}\n`;
  return text;
}

export function parseHeaders(headers: string) {
  const parsedHeaders: { [key: string]: string } = {};
  if (!headers) {
    return parsedHeaders;
  }
  const headerRegEx = /(.*)\: (.*)/g;
  let m;
  while ((m = headerRegEx.exec(headers))) {
    parsedHeaders[m[1]] = m[2];
  }
  return parsedHeaders;
}

export function getMsgDate(rawHeaders: string) {
  const headers = parseHeaders(rawHeaders);
  if (!headers['Date']) {
    return '-';
  }
  return new Date(headers['Date']);
}
