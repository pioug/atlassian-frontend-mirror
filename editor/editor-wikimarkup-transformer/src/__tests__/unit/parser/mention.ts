import WikiMarkupTransformer from '../../..';
import { Context } from '../../../interfaces';

describe('WikiMarkup => ADF Formatters - citation', () => {
  test('[CS-491] should detect mention in the following pattern', () => {
    const wiki = 'Hi [~qm:78032763-2feb-4f5b-88c0-99b50613d53a],';

    const context: Context = {
      conversion: {
        mentionConversion: {
          'qm:78032763-2feb-4f5b-88c0-99b50613d53a':
            '78032763-2feb-4f5b-88c0-99b50613d53a',
        },
      },
    };
    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki, context)).toMatchSnapshot();
  });

  test('should convert mention with context case-insensitively', () => {
    const wiki = 'Hi [~aCCouNtid:AAAAAA],';

    const context: Context = {
      conversion: {
        mentionConversion: {
          'accOunTid:aaaaaa': 'aAaAaA',
        },
      },
    };
    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki, context)).toMatchSnapshot();
  });

  test('Should convert mention without context', () => {
    const wiki = 'Hi [~accountid:78032763-2feb-4f5b-88c0-99b50613d53a],';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });

  test('[CS-1896] Should convert empty mention to plaintext', () => {
    const wiki =
      'Hi [~accountid:], your text is so plain, almost as plain as [~]';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });
});
