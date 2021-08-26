import {
  msgToText,
  formatMessage,
  getMsgDate,
} from '../../../../../viewers/codeViewer/msg-parser';

jest.mock('@kenjiuno/msgreader', () => {
  //ArrayBuffer to String
  function ab2str(buf: ArrayBuffer) {
    return String.fromCharCode.apply(null, new Uint16Array(buf) as any);
  }

  return {
    __esModule: true,

    default: jest.fn((object: ArrayBuffer) => {
      const fileData = JSON.parse(ab2str(object));
      return {
        getFileData: () => {
          return fileData;
        },
        getAttachment: () => {
          if (fileData.attachments) {
            return Array(fileData.attachments.length).fill('');
          }
          return;
        },
      };
    }),
  };
});

//String to ArrayBuffer
function str2ab(str: string) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

//Testing that an email contains a certain field, then that field is rendered/parsed/outputted correctly
describe('Message Parsing for Viewing Emails', () => {
  it('should return an error if the message cannot be parsed by the library', async () => {
    const object = {
      senderName: 'John',
      senderEmail: 'JohnSmith@gmail.com',
      error: 'Unsupported file type!',
    };
    const buf = str2ab(JSON.stringify(object));
    if (typeof buf !== 'string') {
      expect(msgToText(buf)).toEqual({ error: 'Unsupported file type!' });
    }
  });

  it('DATE/FROM/SUBJECT fields should render as expected when they are provided', async () => {
    const object = {
      senderName: 'John',
      senderEmail: 'JohnSmith@gmail.com',
      subject: 'Testing that this works',
      headers: 'Date: Sat, 30 Apr 2005 19:28:29 -0300',
    };
    const buf = str2ab(JSON.stringify(object));

    let date = getMsgDate(object.headers);

    let text =
      `\nDATE:\t\t${date}` +
      `\nFROM:\t\t${object.senderName} <${object.senderEmail}>` +
      `\nSUBJECT:\t${object.subject}`;

    expect(msgToText(buf)).toEqual(formatMessage(text).trim());
  });

  it('RECIPIENTs field should render as expected with multiple recipients', async () => {
    const object = {
      recipients: [
        { name: 'Manuel Lemos', email: 'mlemos@linux.local' },
        { name: 'Gabby Chan', email: 'gchan@atlassian.com' },
      ],
    };

    const buf = str2ab(JSON.stringify(object));

    let text = `TO:\t\t`;

    text += object.recipients
      .map((recipient) => `${recipient.name} <${recipient.email}>`)
      .join(', ');

    expect(msgToText(buf)).toEqual(formatMessage(text).trim());
  });

  it('ATTACHMENTS field should render as expected with multiple attachments', async () => {
    const object = {
      attachments: [
        {
          contentLength: 64,
          dataId: 43,
          extension: '.txt',
          fileName: 'attachment.txt',
          fileNameShort: 'attachme.txt',
          name: 'attachment.txt',
        },
        {
          contentLength: 64,
          dataId: 43,
          extension: '.txt',
          fileName: 'attachment2.txt',
          fileNameShort: 'attachme2.txt',
          name: 'attachment2.txt',
        },
      ],
    };

    const buf = str2ab(JSON.stringify(object));

    let text = '';

    text += `\nATTACHMENTS:\t${object.attachments
      .map(
        (attachment) =>
          `<${attachment.fileName} (${attachment.contentLength} bytes)>`,
      )
      .join(', ')}`;

    expect(msgToText(buf)).toEqual(formatMessage(text).trim());
  });
});
