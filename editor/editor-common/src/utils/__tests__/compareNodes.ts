import { Node as PMNode } from 'prosemirror-model';

import { a, text } from '@atlaskit/editor-test-helpers/doc-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';

import {
  ContentType,
  createNormalizeTextParser,
  extractMetaFromTextNode,
} from '../compareNodes';

describe('compareNodes #extractMetaFromTextNode', () => {
  let languageSpy: jest.SpyInstance;

  beforeAll(() => {
    languageSpy = jest.spyOn(window.navigator, 'language', 'get');
  });

  afterAll(() => {
    languageSpy.mockReset();
  });

  describe.each<[string, { formattedValue: string; rawValue: number }]>([
    [
      'en-US',
      {
        formattedValue: '1,050.98',
        rawValue: 1050.98,
      },
    ],
    [
      'en-GB',
      {
        formattedValue: '1,050.98',
        rawValue: 1050.98,
      },
    ],
    [
      'pt-BR',
      {
        formattedValue: '1.050,98',
        rawValue: 1050.98,
      },
    ],
  ])('%s', (locale, { formattedValue, rawValue }) => {
    beforeEach(() => {
      languageSpy.mockReturnValue(locale);
    });

    it('should extract the first word only when the text has multiple words', () => {
      const textNode = text('some text', defaultSchema);

      const result = extractMetaFromTextNode(
        textNode as PMNode,
        createNormalizeTextParser(),
      );

      expect(result).toEqual({
        type: ContentType.TEXT,
        value: 'some text',
      });
    });

    it('should extract the all text when the first word is a number', () => {
      const textNode = text('2022 some text', defaultSchema);

      const result = extractMetaFromTextNode(
        textNode as PMNode,
        createNormalizeTextParser(),
      );

      expect(result).toEqual({
        type: ContentType.TEXT,
        value: '2022 some text',
      });
    });

    it('should extract a number only when the text contains a number', () => {
      const textNode = text('2022', defaultSchema);

      const result = extractMetaFromTextNode(
        textNode as PMNode,
        createNormalizeTextParser(),
      );

      expect(result).toEqual({
        type: ContentType.NUMBER,
        value: 2022,
      });
    });

    it('should extract a number when the text contains a formatted number', () => {
      const textNode = text(`${formattedValue}`, defaultSchema);

      const result = extractMetaFromTextNode(
        textNode as PMNode,
        createNormalizeTextParser(),
      );

      expect(result).toEqual({
        type: ContentType.NUMBER,
        value: rawValue,
      });
    });

    it('should extract the value as text when the text first word is a mix of number and non-numbers', () => {
      const textNode = text('2022Q3 some text', defaultSchema);

      const result = extractMetaFromTextNode(
        textNode as PMNode,
        createNormalizeTextParser(),
      );

      expect(result).toEqual({
        type: ContentType.TEXT,
        value: '2022Q3 some text',
      });
    });

    it('should extract the value as number when the text first word is a number formatted in the current language', () => {
      const textNode = text(`${formattedValue} some text`, defaultSchema);

      const result = extractMetaFromTextNode(
        textNode as PMNode,
        createNormalizeTextParser(),
      );

      expect(result).toEqual({
        type: ContentType.TEXT,
        value: `${rawValue} some text`,
      });
    });

    it('should extract the value as number when the text first word is a number followed by a dollar sign', () => {
      const textNode = text('1050$ some text', defaultSchema);

      const result = extractMetaFromTextNode(
        textNode as PMNode,
        createNormalizeTextParser(),
      );

      expect(result).toEqual({
        type: ContentType.TEXT,
        value: '1050$ some text',
      });
    });

    it('should set the type to LINK when the text node is a link', () => {
      const linkNode = a({ href: 'gnu.org' })('my link')(defaultSchema)[0];

      const result = extractMetaFromTextNode(
        linkNode,
        createNormalizeTextParser(),
      );

      expect(result).toEqual({
        type: ContentType.LINK,
        value: 'my link',
      });
    });

    it('should set the type to TEXT when the text node is an empty space', () => {
      const textNode = text(' ', defaultSchema);

      const result = extractMetaFromTextNode(
        textNode as PMNode,
        createNormalizeTextParser(),
      );

      expect(result).toEqual({
        type: ContentType.TEXT,
        value: ' ',
      });
    });

    it('should extract complete word when it is concatenated with dots (.)', () => {
      const textNode = text('Foo.Mock Bar', defaultSchema);

      const result = extractMetaFromTextNode(
        textNode as PMNode,
        createNormalizeTextParser(),
      );

      expect(result).toEqual({
        type: ContentType.TEXT,
        value: 'Foo.Mock Bar',
      });
    });

    it('should extract complete word when it is concatenated with hyphens (-)', () => {
      const textNode = text('Foo-Mock Bar', defaultSchema);

      const result = extractMetaFromTextNode(
        textNode as PMNode,
        createNormalizeTextParser(),
      );

      expect(result).toEqual({
        type: ContentType.TEXT,
        value: 'Foo-Mock Bar',
      });
    });
  });
});
