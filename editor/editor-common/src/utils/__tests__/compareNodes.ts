import { Node as PMNode } from 'prosemirror-model';

import { a, text } from '@atlaskit/editor-test-helpers/doc-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';

import { ContentType, extractMetaFromTextNode } from '../compareNodes';

describe('compareNodes', () => {
  describe('#extractTextNode', () => {
    describe('when the text has multiple words', () => {
      it('should extract the first word only', () => {
        const textNode = text('some text', defaultSchema);

        const result = extractMetaFromTextNode(textNode as PMNode);

        expect(result).toEqual({
          type: ContentType.TEXT,
          value: 'some',
        });
      });
    });

    describe('when the text first word is a number', () => {
      it('should extract the number only', () => {
        const textNode = text('2022 some text', defaultSchema);

        const result = extractMetaFromTextNode(textNode as PMNode);

        expect(result).toEqual({
          type: ContentType.NUMBER,
          value: 2022,
        });
      });
    });

    describe('when the text first word is a mix of number and non-numbers', () => {
      it('should extract the value as text', () => {
        const textNode = text('2022Q3 some text', defaultSchema);

        const result = extractMetaFromTextNode(textNode as PMNode);

        expect(result).toEqual({
          type: ContentType.TEXT,
          value: '2022Q3',
        });
      });
    });

    describe('when the text first word is a number formatted in the current language', () => {
      let languageSpy: jest.SpyInstance;

      beforeEach(() => {
        languageSpy = jest.spyOn(window.navigator, 'language', 'get');
      });

      afterEach(() => {
        languageSpy.mockReset();
      });

      describe('pt-BR as current language', () => {
        it('should extract the value as number', () => {
          languageSpy.mockReturnValue('pt-BR');

          const textNode = text('1.050,98 some text', defaultSchema);

          const result = extractMetaFromTextNode(textNode as PMNode);

          expect(result).toEqual({
            type: ContentType.NUMBER,
            value: 1050.98,
          });
        });
      });

      describe('en-US as current language', () => {
        it('should extract the value as number', () => {
          languageSpy.mockReturnValue('en-US');

          const textNode = text('1,050.98 some text', defaultSchema);

          const result = extractMetaFromTextNode(textNode as PMNode);

          expect(result).toEqual({
            type: ContentType.NUMBER,
            value: 1050.98,
          });
        });
      });
    });

    describe('when the text first word is a number followed by a dollar sign', () => {
      it('should extract the value as number', () => {
        const textNode = text('1050$ some text', defaultSchema);

        const result = extractMetaFromTextNode(textNode as PMNode);

        expect(result).toEqual({
          type: ContentType.NUMBER,
          value: 1050,
        });
      });
    });

    describe('when the text first word is a number formatted in the current language', () => {
      it('should extract the value as number', () => {
        const textNode = text('1,050.98 some text', defaultSchema);

        const result = extractMetaFromTextNode(textNode as PMNode);

        expect(result).toEqual({
          type: ContentType.NUMBER,
          value: 1050.98,
        });
      });
    });

    describe('when the text node is a link', () => {
      it('should set the type to LINK', () => {
        const linkNode = a({ href: 'gnu.org' })('my link')(defaultSchema)[0];

        const result = extractMetaFromTextNode(linkNode);

        expect(result).toEqual({
          type: ContentType.LINK,
          value: 'my link',
        });
      });
    });

    describe('when the text node is an empty space', () => {
      it('should set the type to TEXT', () => {
        const textNode = text(' ', defaultSchema);

        const result = extractMetaFromTextNode(textNode as PMNode);

        expect(result).toEqual({
          type: ContentType.TEXT,
          value: ' ',
        });
      });
    });
  });
});
