import { geti18NMessages } from '../../renderer-localisation-provider';
const mockedi18NRendererMessages = { key1: 'value' };
const mockedi18NMentionMessages = { key2: 'Mention value' };

jest.mock('@atlaskit/renderer/src/i18n/es', () => mockedi18NRendererMessages);
jest.mock('@atlaskit/mention/src/i18n/es', () => {});

jest.mock('@atlaskit/mention/src/i18n/pl', () => mockedi18NMentionMessages);
jest.mock('@atlaskit/renderer/src/i18n/pl', () => {});

describe('renderer localisation', () => {
  it('Should load the messages from renderer i18N package for the given locale file Name', async () => {
    const localeFileName = 'es';
    const messages = await geti18NMessages(localeFileName);
    expect(messages).toStrictEqual(mockedi18NRendererMessages);
  });

  it('Should load the messages from mention i18N package for the given locale file Name', async () => {
    const localeFileName = 'pl';
    const messages = await geti18NMessages(localeFileName);
    expect(messages).toStrictEqual(mockedi18NMentionMessages);
  });

  it('should throw error locale file does not exist', async () => {
    const localeFileName = 'unknown';
    await expect(geti18NMessages(localeFileName)).rejects.toThrow();
  });
});
