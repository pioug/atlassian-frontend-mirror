import { geti18NMessages } from '../../editor-localisation-provider';

const mockedi18NEditorCoreMessages = { key1: 'value' };
const mockedi18NMentionMessages = { key2: 'Mention value' };

jest.mock(
  '@atlaskit/editor-core/src/i18n/es',
  () => mockedi18NEditorCoreMessages,
);
jest.mock('@atlaskit/mention/src/i18n/es', () => {});

jest.mock('@atlaskit/mention/src/i18n/pl', () => mockedi18NMentionMessages);
jest.mock('@atlaskit/editor-core/src/i18n/pl', () => {});

describe('editor localisation', () => {
  it('Should load the messages from editor core i18N package for the given locale file Name', async () => {
    const localeFileName = 'es';
    const messages = await geti18NMessages(localeFileName);
    expect(messages).toStrictEqual(mockedi18NEditorCoreMessages);
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
