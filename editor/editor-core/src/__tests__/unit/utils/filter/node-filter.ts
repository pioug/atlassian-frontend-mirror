import { name } from '../../../../version.json';
import { JSONDocNode } from '../../../../utils/index';
import { sanitizeNode } from '../../../../utils/filter/node-filter';
import { doc, p, strong, emoji, br } from '@atlaskit/adf-utils';

describe(name, () => {
  describe('Utils -> filter -> node-filter', () => {
    describe('sanitizeNode()', () => {
      it('should filter out empty status from json document', () => {
        const jsonDoc = {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'status',
                  attrs: {
                    text: '',
                    color: 'neutral',
                    localId: 'aec51b7e-48e2-4686-8902-d312401ce281',
                  },
                },
                {
                  type: 'text',
                  text: ' Boo',
                },
              ],
            },
          ],
        } as JSONDocNode;

        const sanitizedJSON = sanitizeNode(jsonDoc);

        expect(sanitizedJSON).toEqual({
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: ' Boo',
                },
              ],
            },
          ],
        });
      });

      it('should filter out typeAheadQuery marks from json document', () => {
        const jsonDoc = {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: '/',
                  marks: [
                    {
                      type: 'typeAheadQuery',
                    },
                  ],
                },
              ],
            },
          ],
        } as JSONDocNode;

        const sanitizedJSON = sanitizeNode(jsonDoc);

        expect(sanitizedJSON).toEqual({
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: '/',
                  marks: [],
                },
              ],
            },
          ],
        });
      });

      it('should preserve other marks', () => {
        const jsonDoc = {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'this',
                  marks: [
                    {
                      type: 'em',
                    },
                  ],
                },
                {
                  type: 'text',
                  text: ' ',
                },
                {
                  type: 'text',
                  text: 'is',
                  marks: [
                    {
                      type: 'strong',
                    },
                  ],
                },
                {
                  type: 'text',
                  text: ' a ',
                },
                {
                  type: 'text',
                  text: 'text',
                  marks: [
                    {
                      type: 'strike',
                    },
                  ],
                },
              ],
            },
          ],
        } as JSONDocNode;

        const sanitizedJSON = sanitizeNode(jsonDoc);
        expect(sanitizedJSON).toEqual(jsonDoc);
      });

      it('should remove marks from emoji', () => {
        const adf = doc(p(strong(emoji({ shortName: 'grin' }))));
        expect(sanitizeNode(adf)).toEqual(doc(p(emoji({ shortName: 'grin' }))));
      });

      it('should remove marks hardBreak', () => {
        const adf = doc(p(strong(br())));
        expect(sanitizeNode(adf)).toEqual(doc(p(br())));
      });
    });
  });
});
