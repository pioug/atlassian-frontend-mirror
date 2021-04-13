import { br, doc, emoji, p, strong } from '@atlaskit/adf-utils/builders';

import { sanitizeNode } from '../../../sanitize/sanitize-node';
import { JSONDocNode } from '../../../types';

describe('@atlaskit/editor-json-transformer', () => {
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

      it('should filter out empty caption nodes from json document', () => {
        const jsonDoc = {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'mediaSingle',
              attrs: {
                width: 33.33333333333333,
                layout: 'center',
              },
              content: [
                {
                  type: 'media',
                  attrs: {
                    id: 'a559980d-cd47-43e2-8377-27359fcb905f',
                    type: 'file',
                    collection: 'MediaServicesSample',
                    width: 1604,
                    height: 1868,
                  },
                },
                {
                  type: 'caption',
                },
              ],
            },
            {
              type: 'paragraph',
              content: [],
            },
          ],
        } as JSONDocNode;

        const sanitizedJSON = sanitizeNode(jsonDoc);

        expect(sanitizedJSON).toEqual({
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'mediaSingle',
              attrs: {
                width: 33.33333333333333,
                layout: 'center',
              },
              content: [
                {
                  type: 'media',
                  attrs: {
                    id: 'a559980d-cd47-43e2-8377-27359fcb905f',
                    type: 'file',
                    collection: 'MediaServicesSample',
                    width: 1604,
                    height: 1868,
                  },
                },
              ],
            },
            {
              type: 'paragraph',
              content: [],
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
