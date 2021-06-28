declare var global: any;
import {
  createSchema,
  isSafeUrl,
  defaultSchema as schema,
} from '@atlaskit/adf-schema';

import {
  ADDoc,
  ADFStages,
  ADNode,
  getMarksByOrder,
  getValidDocument,
  getValidMark,
  getValidNode,
  getValidUnknownNode,
  isSameMark,
  isSubSupType,
  markOrder,
} from '../../../utils/validator';

describe('Renderer - Validator', () => {
  describe('isSafeUrl', () => {
    const safeURLs = [
      'http:///www.atlassian.com',
      'https://www.atlassian.com',
      'ftp://some.site.com',
      'ftps://some.site.com',
      '//www.atlassian.com',
      '//hipchat.com',
      '//subdomain.somedomain.com',
      '//www.atlassian.com/somepage',
      'mailto:user@mail.com',
      '#anchor-link',
    ];

    const unsafeURLs = [
      'javascript:alert("Hello World!")',
      ' javascript:alert("Hello World!")',
      '\njavascript:alert("Hello World!")',
      'smb:',
    ];

    it('should return true if URL starts with http://, https://, ftp://, ftps:// etc', () => {
      safeURLs.forEach((url) => {
        expect(isSafeUrl(url)).toBe(true);
      });
    });

    it('should return false for "unsafe" URLs', () => {
      unsafeURLs.forEach((url) => {
        expect(isSafeUrl(url)).toBe(false);
      });
    });
  });

  describe('isSubSupType', () => {
    it('should return false if type is not "sub" or "sup"', () => {
      expect(isSubSupType('banana')).toBe(false);
    });

    it('should return true if type is "sub"', () => {
      expect(isSubSupType('sub')).toBe(true);
    });

    it('should return true if type is "sup"', () => {
      expect(isSubSupType('sup')).toBe(true);
    });
  });

  describe('getValidNode', () => {
    describe('codeBlock', () => {
      it('should return codeBlock with only type text', () => {
        const invalidCodeBlockADF = {
          type: 'codeBlock',
          attrs: {
            language: 'javascript',
          },
          content: [
            {
              type: 'text',
              text: 'var foo = {};\nvar bar = [];',
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: 'http://google.com',
                    title: 'Google',
                  },
                },
              ],
            },
          ],
        };
        const validNode = getValidNode(invalidCodeBlockADF);
        expect(validNode.content![0].type).toBe('text');
        expect(validNode.content![0].text).toBe('var foo = {};\nvar bar = [];');
        expect(validNode.content![0].marks).toBe(undefined);
      });
    });

    describe('doc', () => {
      it('should return "text" if version-field is missing', () => {
        expect(getValidNode({ type: 'doc' }).type).toBe('text');
      });

      it('should return "text" if content-field is missing', () => {
        expect(getValidNode({ type: 'doc', version: 1 } as any).type).toBe(
          'text',
        );
      });

      it('should return "text" if content-field is empty-array', () => {
        expect(
          getValidNode({ type: 'doc', version: 1, content: [] } as any).type,
        ).toBe('text');
      });

      it('should return "doc" with content field and without version', () => {
        expect(
          getValidNode({
            type: 'doc',
            version: 1,
            content: [{ type: 'unknown' }],
          } as any),
        ).toStrictEqual({
          type: 'doc',
          content: [
            {
              type: 'text',
              text: '[unknown]',
            },
          ],
        });
      });
    });

    describe('emoji', () => {
      it('should pass through attrs as emoji', () => {
        const emojiId = {
          shortName: ':grinning:',
          id: '123',
          fallback: 'cheese',
        };
        const { type, attrs } = getValidNode({ type: 'emoji', attrs: emojiId });
        expect(type).toBe('emoji');
        expect(attrs).toStrictEqual(emojiId);
      });

      it('should pass through attrs with only shortName as emoji', () => {
        const emojiId = { shortName: ':grinning:' };
        const { type, attrs } = getValidNode({ type: 'emoji', attrs: emojiId });
        expect(type).toBe('emoji');
        expect(attrs).toStrictEqual(emojiId);
      });

      it('should reject emoji without shortName', () => {
        const emojiId = { id: '123', fallback: 'cheese' };
        const { type } = getValidNode({ type: 'emoji', attrs: emojiId });
        expect(type).toBe('text');
      });
    });

    describe('date', () => {
      it('should pass through attrs as timestamp', () => {
        const timestamp = {
          timestamp: 1528886473152,
        };
        const { type, attrs } = getValidNode({
          type: 'date',
          attrs: timestamp,
        });
        expect(type).toBe('date');
        expect(attrs).toStrictEqual(timestamp);
      });

      it('should reject date without timestamp', () => {
        const { type } = getValidNode({ type: 'date' });
        expect(type).toBe('text');
      });
    });

    describe('panel', () => {
      it('should pass through attrs', () => {
        const attributes = {
          panelType: 'info',
        };
        const { type, attrs } = getValidNode({
          type: 'panel',
          attrs: attributes,
          content: [],
        });
        expect(type).toBe('panel');
        expect(attrs).toStrictEqual(attributes);
      });
    });

    describe('status', () => {
      it('should pass through attrs', () => {
        const attributes = {
          text: 'Done',
          color: 'green',
          localId: '666',
          style: 'bold',
        };
        const { type, attrs } = getValidNode({
          type: 'status',
          attrs: attributes,
        });
        expect(type).toBe('status');
        expect(attrs).toStrictEqual(attributes);
      });

      it('should reject status without text', () => {
        const { type } = getValidNode({
          type: 'status',
          attrs: {
            color: 'neutral',
            localId: '666',
          },
        });
        expect(type).toBe('text');
      });

      it('should reject status without color', () => {
        const { type } = getValidNode({
          type: 'status',
          attrs: {
            text: 'Done',
            localId: '666',
          },
        });
        expect(type).toBe('text');
      });
    });

    describe('bodiedExtension', () => {
      it('should pass through attrs as extension', () => {
        const extensionAttrs = {
          text: 'This is an extension',
          extensionType: 'com.atlassian.connect.extension',
          extensionKey: 'CallWithSkype',
          bodyType: 'none',
        };
        const { type } = getValidNode({
          type: 'bodiedExtension',
          attrs: extensionAttrs,
          content: [],
        });
        expect(type).toBe('bodiedExtension');
      });

      it('should reject extensions without extensionType', () => {
        const extensionAttrs = {
          text: 'This is an extension',
          extensionKey: 'CallWithSkype',
          bodyType: 'none',
        };
        const { type } = getValidNode({
          type: 'extension',
          attrs: extensionAttrs,
        });
        expect(type).toBe('text');
      });

      it('should reject extensions without extensionKey', () => {
        const extensionAttrs = {
          text: 'This is an extension',
          extensionType: 'com.atlassian.connect.extension',
          bodyType: 'none',
        };
        const { type } = getValidNode({
          type: 'extension',
          attrs: extensionAttrs,
        });
        expect(type).toBe('text');
      });
    });

    describe('extension', () => {
      it('should pass through attrs as extension', () => {
        const extensionAttrs = {
          text: 'This is an extension',
          extensionType: 'com.atlassian.connect.extension',
          extensionKey: 'CallWithSkype',
          bodyType: 'none',
        };
        const { type, attrs } = getValidNode({
          type: 'extension',
          attrs: extensionAttrs,
        });
        expect(type).toBe('extension');
        expect(attrs).toStrictEqual(extensionAttrs);
      });

      it('should reject extensions without extensionType', () => {
        const extensionAttrs = {
          text: 'This is an extension',
          extensionKey: 'CallWithSkype',
          bodyType: 'none',
        };
        const { type } = getValidNode({
          type: 'extension',
          attrs: extensionAttrs,
        });
        expect(type).toBe('text');
      });

      it('should reject extensions without extensionKey', () => {
        const extensionAttrs = {
          text: 'This is an extension',
          extensionType: 'com.atlassian.connect.extension',
          bodyType: 'none',
        };
        const { type } = getValidNode({
          type: 'extension',
          attrs: extensionAttrs,
        });
        expect(type).toBe('text');
      });
    });

    describe('inlineExtension', () => {
      it('should pass through attrs as inlineExtension', () => {
        const extensionAttrs = {
          text: 'This is an inlineExtension',
          extensionType: 'com.atlassian.connect.inlineExtension',
          extensionKey: 'CallWithSkype',
          bodyType: 'none',
        };
        const { type, attrs } = getValidNode({
          type: 'inlineExtension',
          attrs: extensionAttrs,
        });
        expect(type).toBe('inlineExtension');
        expect(attrs).toStrictEqual(extensionAttrs);
      });

      it('should reject inlineExtension without extensionType', () => {
        const extensionAttrs = {
          text: 'This is an inlineExtension',
          extensionKey: 'CallWithSkype',
          bodyType: 'none',
        };
        const { type } = getValidNode({
          type: 'inlineExtension',
          attrs: extensionAttrs,
        });
        expect(type).toBe('text');
      });

      it('should reject inlineExtension without extensionKey', () => {
        const extensionAttrs = {
          text: 'This is an inlineExtension',
          extensionType: 'com.atlassian.connect.inlineExtension',
          bodyType: 'none',
        };
        const { type } = getValidNode({
          type: 'inlineExtension',
          attrs: extensionAttrs,
        });
        expect(type).toBe('text');
      });
    });

    describe('hardBreak', () => {
      it('should return "hardBreak"', () => {
        expect(getValidNode({ type: 'hardBreak' })).toStrictEqual({
          type: 'hardBreak',
        });
      });

      it('should discard any extranous attributes', () => {
        expect(
          getValidNode({ type: 'hardBreak', attrs: { color: 'green' } }),
        ).toStrictEqual({ type: 'hardBreak' });
      });
    });

    describe('mention', () => {
      it('should return "unknown" if it can not find an ID ', () => {
        expect(
          getValidNode({ type: 'mention', attrs: { text: '@Oscar' } }).type,
        ).toStrictEqual('text');
      });

      it('should use attrs.text if present', () => {
        expect(
          getValidNode({
            type: 'mention',
            attrs: { text: '@Oscar', id: 'abcd-abcd-abcd' },
          }),
        ).toStrictEqual({
          type: 'mention',
          attrs: {
            id: 'abcd-abcd-abcd',
            text: '@Oscar',
            accessLevel: '',
          },
        });
      });

      it('should use attrs.displayName if present and attrs.text is missing', () => {
        expect(
          getValidNode({
            type: 'mention',
            attrs: { displayName: '@Oscar', id: 'abcd-abcd-abcd' },
          }),
        ).toStrictEqual({
          type: 'mention',
          attrs: {
            text: '@Oscar',
            id: 'abcd-abcd-abcd',
            accessLevel: '',
          },
        });
      });

      it('should use .text if present and attrs.text and attrs.displayName is missing', () => {
        expect(
          getValidNode({
            type: 'mention',
            text: '@Oscar',
            attrs: { id: 'abcd-abcd-abcd' },
          }),
        ).toStrictEqual({
          type: 'mention',
          attrs: {
            text: '@Oscar',
            id: 'abcd-abcd-abcd',
            accessLevel: '',
          },
        });
      });

      it('should set attrs.text to "@unknown" if no valid text-property is available', () => {
        expect(
          getValidNode({ type: 'mention', attrs: { id: 'abcd-abcd-abcd' } }),
        ).toStrictEqual({
          type: 'mention',
          attrs: {
            text: '@unknown',
            id: 'abcd-abcd-abcd',
            accessLevel: '',
          },
        });
      });
    });

    describe('paragraph', () => {
      it('should return with an empty content node if content-field is missing', () => {
        const newDoc = getValidNode({ type: 'paragraph' });
        expect(newDoc).toHaveProperty('type', 'paragraph');

        expect(newDoc).toHaveProperty('content', []);
      });

      it('should return "paragraph" if content-field is empty array', () => {
        expect(getValidNode({ type: 'paragraph', content: [] }).type).toBe(
          'paragraph',
        );
      });

      it('should return "paragraph" with content', () => {
        expect(
          getValidNode({
            type: 'paragraph',
            content: [{ type: 'text', text: 'Hello World' }],
          }),
        ).toStrictEqual({
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello World',
            },
          ],
        });
      });
    });

    describe('text', () => {
      it('should return "text" with text', () => {
        expect(
          getValidNode({ type: 'text', text: 'Hello World' }),
        ).toStrictEqual({
          type: 'text',
          text: 'Hello World',
        });

        expect(
          getValidNode({
            type: 'text',
            text: 'Hello World',
            marks: [{ type: 'strong' }],
          }),
        ).toStrictEqual({
          type: 'text',
          text: 'Hello World',
          marks: [
            {
              type: 'strong',
            },
          ],
        });
      });
    });

    describe('mediaGroup', () => {
      it('should return "mediaGroup" with type and content', () => {
        expect(
          getValidNode({
            type: 'mediaGroup',
            content: [
              {
                type: 'media',
                attrs: {
                  type: 'file',
                  id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
                  collection: 'MediaServicesSample',
                },
              },
            ],
          }),
        ).toStrictEqual({
          type: 'mediaGroup',
          content: [
            {
              type: 'media',
              attrs: {
                type: 'file',
                id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
                collection: 'MediaServicesSample',
              },
            },
          ],
        });
      });

      it('should return "unknownBlock" if some of it\'s content is not media', () => {
        expect(
          getValidNode({
            type: 'mediaGroup',
            content: [
              {
                type: 'text',
                text: '[media]',
              },
            ],
          }),
        ).toStrictEqual({
          type: 'unknownBlock',
          content: [
            {
              type: 'text',
              text: '[media]',
            },
          ],
        });
      });
    });

    describe('mediaSingle', () => {
      // use jest assertions
      const expect = global.expect;

      it('should return "mediaSingle" with type, attrs and content', () => {
        const validADFChunk = {
          type: 'mediaSingle',
          attrs: { layout: 'full-width' },
          content: [
            {
              type: 'media',
              attrs: {
                type: 'file',
                id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
                collection: 'MediaServicesSample',
              },
            },
          ],
        };

        expect(getValidNode(validADFChunk)).toEqual(validADFChunk);
      });

      it('should return "mediaSingle" with link-mark', () => {
        const validADFChunk = {
          type: 'mediaSingle',
          attrs: { layout: 'full-width' },
          content: [
            {
              type: 'media',
              attrs: {
                type: 'file',
                id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
                collection: 'MediaServicesSample',
              },
            },
          ],
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://www.atlassian.com',
              },
            },
          ],
        };

        expect(getValidNode(validADFChunk)).toEqual(validADFChunk);
      });

      it('should return remove unsafe link-mark', () => {
        const invalidADFChunk = {
          type: 'mediaSingle',
          attrs: { layout: 'full-width' },
          content: [
            {
              type: 'media',
              attrs: {
                type: 'file',
                id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
                collection: 'MediaServicesSample',
              },
            },
          ],
          marks: [
            {
              type: 'link',
              href: 'javascript:alert("hacks")',
            },
          ],
        };

        expect(getValidNode(invalidADFChunk)).toEqual({
          type: 'mediaSingle',
          attrs: { layout: 'full-width' },
          content: [
            {
              type: 'media',
              attrs: {
                type: 'file',
                id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
                collection: 'MediaServicesSample',
              },
            },
          ],
          marks: [],
        });
      });

      it('should return "unknownBlock" if some of its content is not media', () => {
        const invalidADFChunk = {
          type: 'mediaSingle',
          attrs: { layout: 'full-width' },
          content: [
            {
              type: 'mention',
              attrs: {
                id: 'abcd-abcd-abcd',
                text: '@Oscar',
              },
            },
          ],
        };

        expect(getValidNode(invalidADFChunk)).toEqual({
          type: 'unknownBlock',
          content: [
            {
              type: 'mention',
              attrs: {
                accessLevel: '',
                id: 'abcd-abcd-abcd',
                text: '@Oscar',
              },
            },
          ],
        });
      });

      it('should return "mediaGroup" if children count is more than 1', () => {
        const invalidADFChunk = {
          type: 'mediaSingle',
          attrs: { layout: 'full-width' },
          content: [
            {
              type: 'media',
              attrs: {
                type: 'file',
                id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
                collection: 'MediaServicesSample',
              },
            },
            {
              type: 'media',
              attrs: {
                type: 'file',
                id: '5556346b-b081-482b-bc4a-4faca8ecd2df',
                collection: 'MediaServicesSample',
              },
            },
          ],
        };

        // actually this is invalid tree even for renderer
        // in this case pm.check() fails and "Unsupported content" message is rendered
        expect(getValidNode(invalidADFChunk)).toEqual({
          type: 'unknownBlock',
          content: [
            {
              type: 'media',
              attrs: {
                type: 'file',
                id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
                collection: 'MediaServicesSample',
              },
            },
            {
              type: 'text',
              text: ' ',
            },
            {
              type: 'media',
              attrs: {
                type: 'file',
                id: '5556346b-b081-482b-bc4a-4faca8ecd2df',
                collection: 'MediaServicesSample',
              },
            },
          ],
        });
      });
    });

    describe('media', () => {
      it('should return "media" with attrs and type', () => {
        expect(
          getValidNode({
            type: 'media',
            attrs: {
              type: 'file',
              id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
              collection: 'MediaServicesSample',
            },
          }),
        ).toStrictEqual({
          type: 'media',
          attrs: {
            type: 'file',
            id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
            collection: 'MediaServicesSample',
          },
        });
      });

      it('should return "media" with attrs and type if collection is empty', () => {
        expect(
          getValidNode({
            type: 'media',
            attrs: {
              type: 'file',
              id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
              collection: '',
            },
          }),
        ).toStrictEqual({
          type: 'media',
          attrs: {
            type: 'file',
            id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
            collection: '',
          },
        });
      });

      it('should add width and height attrs if they are present', () => {
        expect(
          getValidNode({
            type: 'media',
            attrs: {
              type: 'file',
              id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
              collection: 'MediaServicesSample',
              width: 200,
              height: 100,
            },
          }),
        ).toStrictEqual({
          type: 'media',
          attrs: {
            type: 'file',
            id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
            collection: 'MediaServicesSample',
            width: 200,
            height: 100,
          },
        });
      });
    });

    describe('decisions', () => {
      it('should pass through attrs for decisionList', () => {
        const listAttrs = { localId: 'cheese' };
        const listContent = [
          {
            type: 'text',
            text: 'content',
          },
        ];
        const { type, attrs, content } = getValidNode({
          type: 'decisionList',
          attrs: listAttrs,
          content: listContent,
        });
        expect(type).toBe('decisionList');
        expect(attrs).toStrictEqual(listAttrs);
        expect(content).toStrictEqual(listContent);
      });

      it('should generate localId for decisionList if missing', () => {
        const listContent = [
          {
            type: 'text',
            text: 'content',
          },
        ];
        const { type, attrs, content } = getValidNode({
          type: 'decisionList',
          content: listContent,
        });
        expect(type).toBe('decisionList');
        expect(attrs).not.toEqual(undefined);
        expect(attrs.localId).not.toEqual(undefined);
        expect(content).toStrictEqual(listContent);
      });

      it('should pass through attrs for decisionItem', () => {
        const itemAttrs = { localId: 'cheese', state: 'DECIDED' };
        const itemContent = [
          {
            type: 'text',
            text: 'content',
          },
        ];
        const { type, attrs, content } = getValidNode({
          type: 'decisionItem',
          attrs: itemAttrs,
          content: itemContent,
        });
        expect(type).toBe('decisionItem');
        expect(attrs).toStrictEqual(itemAttrs);
        expect(content).toStrictEqual(itemContent);
      });

      it('should generate localId for decisionItem if missing', () => {
        const itemAttrs = { state: 'DECIDED' };
        const itemContent = [
          {
            type: 'text',
            text: 'content',
          },
        ];
        const { type, attrs, content } = getValidNode({
          type: 'decisionItem',
          attrs: itemAttrs,
          content: itemContent,
        });
        expect(type).toBe('decisionItem');
        expect(attrs).not.toBe(undefined);
        expect(attrs.state).toBe('DECIDED');
        expect(attrs.localId).not.toBe(undefined);
        expect(content).toStrictEqual(itemContent);
      });
    });

    describe('tasks', () => {
      it('should pass through attrs for taskList', () => {
        const listAttrs = { localId: 'cheese' };
        const listContent = [
          {
            type: 'text',
            text: 'content',
          },
        ];
        const { type, attrs, content } = getValidNode({
          type: 'taskList',
          attrs: listAttrs,
          content: listContent,
        });
        expect(type).toBe('taskList');
        expect(attrs).toStrictEqual(listAttrs);
        expect(content).toStrictEqual(listContent);
      });

      it('should generate localId for taskList if missing', () => {
        const listContent = [
          {
            type: 'text',
            text: 'content',
          },
        ];
        const { type, attrs, content } = getValidNode({
          type: 'taskList',
          content: listContent,
        });
        expect(type).toBe('taskList');
        expect(attrs).not.toEqual(undefined);
        expect(attrs.localId).not.toEqual(undefined);
        expect(content).toStrictEqual(listContent);
      });

      it('should pass through attrs for taskItem', () => {
        const itemAttrs = { localId: 'cheese', state: 'DONE' };
        const itemContent = [
          {
            type: 'text',
            text: 'content',
          },
        ];
        const { type, attrs, content } = getValidNode({
          type: 'taskItem',
          attrs: itemAttrs,
          content: itemContent,
        });
        expect(type).toBe('taskItem');
        expect(attrs).toStrictEqual(itemAttrs);
        expect(content).toStrictEqual(itemContent);
      });

      it('should generate localId for taskItem if missing', () => {
        const itemAttrs = { state: 'DONE' };
        const itemContent = [
          {
            type: 'text',
            text: 'content',
          },
        ];
        const { type, attrs, content } = getValidNode({
          type: 'taskItem',
          attrs: itemAttrs,
          content: itemContent,
        });
        expect(type).toBe('taskItem');
        expect(attrs).not.toEqual(undefined);
        expect(attrs.state).toBe('DONE');
        expect(attrs.localId).not.toEqual(undefined);
        expect(content).toStrictEqual(itemContent);
      });
    });

    describe('image', () => {
      it('should pass through attrs as image', () => {
        const imageAttrs = {
          src: 'http://example.com/test.jpg',
          alt: 'explanation',
          title: 'image',
        };
        const { type, attrs } = getValidNode({
          type: 'image',
          attrs: imageAttrs,
        });
        expect(type).toBe('image');
        expect(attrs).toStrictEqual(imageAttrs);
      });

      it('should pass through attrs with only src as image', () => {
        const imageAttrs = { src: 'http://example.com/test.jpg' };
        const { type, attrs } = getValidNode({
          type: 'image',
          attrs: imageAttrs,
        });
        expect(type).toBe('image');
        expect(attrs).toStrictEqual(imageAttrs);
      });

      it('should reject image without src', () => {
        const imageAttrs = { alt: 'explanation' };
        const { type } = getValidNode({
          type: 'image',
          attrs: imageAttrs,
        });
        expect(type).toBe('text');
      });
    });

    describe('listItem', () => {
      it('should handle invalid child nodes without crashing', () => {
        const itemContent = [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: '[confluenceUnsupportedBlock]',
              },
            ],
          },
        ];

        const { content } = getValidNode({
          type: 'listItem',
          content: [
            {
              type: 'confluenceUnsupportedBlock',
              attrs: {},
            },
          ],
        });
        expect(content).toStrictEqual(itemContent);
      });
    });

    describe('table', () => {
      const tableContent = [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
          ],
        },
      ];

      it('should not return any attrs when adfStage=final', () => {
        const { type, attrs, content } = getValidNode(
          {
            type: 'table',
            content: tableContent,
          },
          schema,
          'final',
        );

        expect(type).toBe('table');
        expect(attrs).toEqual(undefined);
        expect(content).toStrictEqual(tableContent);
      });

      it.each<
        [
          string,
          {
            provideAttributes: boolean;
            providedLocalId?: string;
          },
        ]
      >([
        [
          'stage0: SHUOLD generate localId for table if attr is missing',
          { provideAttributes: false },
        ],
        [
          'stage0: SHUOLD generate localId for table if attr does not have localId',
          { provideAttributes: true },
        ],
        [
          'stage0: should not override a provided localid attr',
          {
            provideAttributes: true,
            providedLocalId: 'some-uuid-fyi-mochi-is-a-fluffy-cat',
          },
        ],
      ])('%s', (_, { provideAttributes, providedLocalId }) => {
        const attrsToValidate = {
          localId: providedLocalId,
        };
        const { type, attrs, content } = getValidNode(
          {
            type: 'table',
            content: tableContent,
            attrs: provideAttributes && attrsToValidate,
          },
          schema,
          'stage0',
        );

        expect(type).toBe('table');
        if (provideAttributes) {
          expect(attrs).not.toEqual(undefined);
          if (providedLocalId) {
            // If we provided a localId, it should equal that
            expect(attrs.localId).toEqual(providedLocalId);
          } else {
            // If we didn't give a localId, it should be generated for us
            expect(attrs.localId).not.toEqual(undefined);
          }
        } else {
          // Otherwise an attributes object should exist & have a localId
          // generated for us
          expect(attrs).not.toEqual(undefined);
          expect(attrs.localId).not.toEqual(undefined);
        }
        expect(content).toStrictEqual(tableContent);
      });
    });

    ['tableCell', 'tableHeader'].forEach((nodeName) => {
      describe(nodeName, () => {
        const cellAttrs = {
          colspan: 2,
          rowspan: 3,
          colwidth: [4],
          background: '#dabdab',
        };

        it('should pass through attrs', () => {
          const { type, attrs } = getValidNode({
            type: nodeName,
            attrs: cellAttrs,
            content: [],
          });
          expect(type).toBe(nodeName);
          expect(attrs).toStrictEqual(cellAttrs);
        });

        const attributeTests = new Map([
          ['no attrs', undefined],
          ['empty attrs', {}],
          ['only colspan', { colspan: 2 }],
          ['only rowspan', { rowspan: 2 }],
        ]);

        attributeTests.forEach((testAttr, testName) => {
          it(`should allow ${nodeName} with ${testName}`, () => {
            const { type, attrs } = getValidNode({
              type: nodeName,
              attrs: testAttr,
              content: [],
            });
            expect(type).toBe(nodeName);
            // TODO: to fix the types
            // @ts-ignore
            expect(attrs).toStrictEqual(testAttr);
          });
        });

        it(`should reject ${nodeName} without content`, () => {
          const { type } = getValidNode({
            type: nodeName,
            attrs: cellAttrs,
          });
          expect(type).toBe('text');
        });
      });
    });

    it('should overwrite the default schema if it gets a docSchema parameter', () => {
      // rule is taken out in following schema
      const schema = createSchema({
        nodes: [
          'doc',
          'paragraph',
          'text',
          'bulletList',
          'orderedList',
          'listItem',
          'heading',
          'blockquote',
          'codeBlock',
          'panel',
          'image',
          'mention',
          'hardBreak',
          'emoji',
          'mediaGroup',
          'media',
          'table',
          'tableCell',
          'tableHeader',
          'tableRow',
        ],
        marks: [
          'em',
          'strong',
          'code',
          'strike',
          'underline',
          'link',
          'textColor',
          'subsup',
        ],
      });

      const doc = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'rule',
          },
        ],
      };
      const result = getValidNode(doc, schema);

      expect(result.content![0].type).toBe('text');
      expect(result.content![0].text).toBe('[rule]');
    });
  });

  describe('getValidUnknownNode', () => {
    describe('unknown inline nodes', () => {
      it('should return "text" node if content is absent', () => {
        const unknownInlineNode = getValidUnknownNode({ type: 'foobar' });
        expect(unknownInlineNode.type).toBe('text');
      });

      it('should return "text" node if content is empty', () => {
        const unknownInlineNode = getValidUnknownNode({
          type: 'foobar',
          content: [],
        });
        expect(unknownInlineNode.type).toBe('text');
      });

      it('should store textUrl attribute in "href" attribute', () => {
        const unknownInlineNode = getValidUnknownNode({
          type: 'foobar',
          attrs: { textUrl: 'https://www.atlassian.com' },
        });
        expect(unknownInlineNode.marks).toHaveLength(1);
        expect(unknownInlineNode.marks![0].attrs.href).toBe(
          'https://www.atlassian.com',
        );
      });

      it('should not store unsafe textUrl attribute in "href" attribute', () => {
        const unknownInlineNode = getValidUnknownNode({
          type: 'foobar',
          attrs: { textUrl: 'javascript:alert("haxx")' },
        });
        expect(unknownInlineNode.marks).toBe(undefined);
      });

      it('should use default text', () => {
        const unknownInlineNode = getValidUnknownNode({
          type: 'foobar',
          text: 'some text',
          attrs: { text: 'some text from attrs' },
        });
        expect(unknownInlineNode.text).toBe('some text');
      });

      it('should use node.attrs.text if text is missing', () => {
        const unknownInlineNode = getValidUnknownNode({
          type: 'foobar',
          attrs: { text: 'some text from attrs' },
        });
        expect(unknownInlineNode.text).toBe('some text from attrs');
      });

      it('should use original type in square brackets if neither text nor attrs.text is missing', () => {
        const unknownInlineNode = getValidUnknownNode({ type: 'foobar' });
        expect(unknownInlineNode.text).toBe('[foobar]');
      });
    });

    describe('unknown block nodes', () => {
      it('should build flattened tree from unknown block node #1', () => {
        const node = {
          type: 'foobar',
          content: [
            {
              type: 'text',
              text: 'hello',
            },
            {
              type: 'world-node-type',
              text: 'world',
            },
          ],
        };

        const unknownBlockNode = getValidUnknownNode(node);
        expect(unknownBlockNode).toStrictEqual({
          type: 'unknownBlock',
          content: [
            {
              type: 'text',
              text: 'hello',
            },
            {
              type: 'text',
              text: ' ',
            },
            {
              type: 'text',
              text: 'world',
            },
          ],
        });
      });

      it('should build flattened tree from unknown block node #2', () => {
        const node = {
          type: 'foobar-table',
          content: [
            {
              type: 'foobar-row',
              content: [
                {
                  type: 'text',
                  text: 'hello mate',
                },
              ],
            },
            {
              type: 'foobar-row',
              content: [
                {
                  type: 'foobar-cell',
                  content: [
                    {
                      type: 'text',
                      text: 'this is',
                    },
                    {
                      type: 'special-sydney-node-type',
                      text: 'Sydney!',
                    },
                  ],
                },
              ],
            },
          ],
        };

        const unknownBlockNode = getValidUnknownNode(node);
        expect(unknownBlockNode).toStrictEqual({
          type: 'unknownBlock',
          content: [
            {
              type: 'text',
              text: 'hello mate',
            },
            {
              type: 'hardBreak',
            },
            {
              type: 'text',
              text: 'this is',
            },
            {
              type: 'text',
              text: ' ',
            },
            {
              type: 'text',
              text: 'Sydney!',
            },
          ],
        });
      });

      it('should build flattened tree from unknown block node #3', () => {
        const node = {
          type: 'foobar-table',
          content: [
            {
              type: 'foobar-row',
              content: [
                {
                  type: 'text',
                  text: 'hello mate',
                },
              ],
            },
            {
              type: 'foobar-row',
              content: [
                {
                  type: 'foobar-row',
                  content: [
                    {
                      type: 'foobar-cell',
                      content: [
                        {
                          type: 'text',
                          text: 'this is',
                        },
                        {
                          type: 'special-sydney-node-type',
                          attrs: {
                            textUrl: 'http://www.sydney.com.au/',
                          },
                          text: 'Sydney!',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        };

        const unknownBlockNode = getValidUnknownNode(node);
        expect(unknownBlockNode).toStrictEqual({
          type: 'unknownBlock',
          content: [
            {
              type: 'text',
              text: 'hello mate',
            },
            {
              type: 'hardBreak',
            },
            {
              type: 'text',
              text: 'this is',
            },
            {
              type: 'text',
              text: ' ',
            },
            {
              type: 'text',
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: 'http://www.sydney.com.au/',
                  },
                },
              ],
              text: 'Sydney!',
            },
          ],
        });
      });
    });
  });

  describe('getValidMark', () => {
    describe('unknown', () => {
      it('should return null if type is unknown', () => {
        expect(getValidMark({ type: 'banana' })).toBe(null);
      });
    });

    describe('em', () => {
      it('should return "em"', () => {
        expect(getValidMark({ type: 'em' })).toStrictEqual({
          type: 'em',
        });
      });
    });

    describe('link', () => {
      it('should return null if attrs is missing', () => {
        expect(getValidMark({ type: 'link' })).toBe(null);
      });

      it('should return null if both attrs.href and attrs.url are missing', () => {
        expect(getValidMark({ type: 'link', attrs: {} })).toBe(null);
      });

      it('should use attrs.href if present', () => {
        expect(
          getValidMark({
            type: 'link',
            attrs: { href: 'https://www.atlassian.com' },
          }),
        ).toStrictEqual({
          type: 'link',
          attrs: {
            href: 'https://www.atlassian.com',
          },
        });
      });

      it('should add protocol to a url if it doesn`t exist', () => {
        expect(
          getValidMark({ type: 'link', attrs: { href: 'www.atlassian.com' } }),
        ).toStrictEqual({
          type: 'link',
          attrs: {
            href: 'http://www.atlassian.com',
          },
        });
      });

      it('should use attrs.url if present and attrs.href is missing', () => {
        expect(
          getValidMark({
            type: 'link',
            attrs: { url: 'https://www.atlassian.com' },
          }),
        ).toStrictEqual({
          type: 'link',
          attrs: {
            href: 'https://www.atlassian.com',
          },
        });
      });

      it('should allow relative links', () => {
        expect(
          getValidMark({
            type: 'link',
            attrs: { href: '/this/is/a/relative/link' },
          }),
        ).toStrictEqual({
          type: 'link',
          attrs: {
            href: '/this/is/a/relative/link',
          },
        });
      });

      it('should allow anchor links', () => {
        expect(
          getValidMark({
            type: 'link',
            attrs: { href: '#anchor-link' },
          }),
        ).toStrictEqual({
          type: 'link',
          attrs: {
            href: '#anchor-link',
          },
        });
      });
    });

    describe('strike', () => {
      it('should return "strike"', () => {
        expect(getValidMark({ type: 'strike' })).toStrictEqual({
          type: 'strike',
        });
      });
    });

    describe('strong', () => {
      it('should return "strong"', () => {
        expect(getValidMark({ type: 'strong' })).toStrictEqual({
          type: 'strong',
        });
      });
    });

    describe('subsup', () => {
      it('should return null if attrs is missing', () => {
        expect(getValidMark({ type: 'subsup' })).toBe(null);
      });

      it('should return null if attrs.type is not sub or sup', () => {
        expect(
          getValidMark({ type: 'subsup', attrs: { type: 'banana' } }),
        ).toBe(null);
      });

      it('should return "subsup" with correct type', () => {
        expect(
          getValidMark({ type: 'subsup', attrs: { type: 'sub' } }),
        ).toStrictEqual({
          type: 'subsup',
          attrs: {
            type: 'sub',
          },
        });

        expect(
          getValidMark({ type: 'subsup', attrs: { type: 'sup' } }),
        ).toStrictEqual({
          type: 'subsup',
          attrs: {
            type: 'sup',
          },
        });
      });
    });

    describe('textColor', () => {
      it('should return "textColor"', () => {
        expect(
          getValidMark({ type: 'textColor', attrs: { color: '#ff0000' } }),
        ).toStrictEqual({
          type: 'textColor',
          attrs: {
            color: '#ff0000',
          },
        });
      });

      it('should return "textColor" for uppercase color', () => {
        expect(
          getValidMark({ type: 'textColor', attrs: { color: '#FF0000' } }),
        ).toStrictEqual({
          type: 'textColor',
          attrs: {
            color: '#FF0000',
          },
        });
      });

      it('should skip nodes if color attribute is missing', () => {
        expect(getValidMark({ type: 'textColor' })).toBe(null);
      });

      it("should skip nodes if color attribute doesn't match RGB pattern", () => {
        expect(
          getValidMark({ type: 'textColor', attrs: { color: 'red' } }),
        ).toBe(null);
      });
    });

    describe('underline', () => {
      it('should return "underline"', () => {
        expect(getValidMark({ type: 'underline' })).toStrictEqual({
          type: 'underline',
        });
      });
    });

    describe('dataConsumer', () => {
      it('final: should return null for "dataConsumer"', () => {
        expect(getValidMark({ type: 'dataConsumer' })).toEqual(null);
      });
      describe('stage0:', () => {
        it('should return a "dataConsumer"', () => {
          expect(
            getValidMark({ type: 'dataConsumer' }, ADFStages.STAGE_0),
          ).toEqual({
            type: 'dataConsumer',
          });
        });
        it('should return a "dataConsumer" with some attributes', () => {
          const someAttrs = { foo: 'bar' };
          expect(
            getValidMark(
              { type: 'dataConsumer', attrs: someAttrs },
              ADFStages.STAGE_0,
            ),
          ).toStrictEqual({
            type: 'dataConsumer',
            attrs: someAttrs,
          });
        });
      });
    });
  });

  describe('getMarksByOrder', () => {
    const {
      link,
      em,
      strong,
      textColor,
      strike,
      subsup,
      underline,
      code,
      confluenceInlineComment,
      annotation,
    } = schema.marks;

    it('should return marks in right order', () => {
      const unorderedMarks = [
        strong.create(),
        subsup.create(),
        code.create(),
        em.create(),
        link.create({ href: 'www.atlassian.com' }),
        textColor.create({ color: '#97a0af' }),
        underline.create(),
        confluenceInlineComment.create(),
        strike.create(),
        annotation.create(),
      ];

      const orderedMarks = getMarksByOrder(unorderedMarks);
      orderedMarks.forEach((mark, index) => {
        expect(markOrder[index]).toBe(mark.type.name);
      });
    });
  });

  describe('isSameMark', () => {
    const { strong, strike, link } = schema.marks;

    const strongMark = strong.create();
    const strikeMark = strike.create();

    const linkMark1 = link.create({ href: 'www.atlassian.com' });
    const linkMark2 = link.create({ href: 'www.hipchat.com' });

    it('should return false if mark is null or otherMark is null', () => {
      expect(isSameMark(null, strongMark)).toBe(false);
      expect(isSameMark(strongMark, null)).toBe(false);
    });

    it('should return false if type is not the same', () => {
      expect(isSameMark(strongMark, strikeMark)).toBe(false);
    });

    it('should return false if mark-type is the same but attributes is not', () => {
      expect(isSameMark(linkMark1, linkMark2)).toBe(false);
    });

    it('should return true if type is the same and attributes match', () => {
      expect(isSameMark(linkMark1, linkMark1)).toBe(true);
    });
  });

  describe('getValidDocument', () => {
    it('should not mutate original document', () => {
      const original: ADDoc = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'decisionList',
            attrs: {
              localId: 'dl1',
              mysteryAttr: 'cheese',
            },
            content: [
              {
                type: 'decisionItem',
                attrs: {
                  localId: 'di1',
                  state: 'DECIDED',
                  mysteryAttr2: 'bacon',
                },
                content: [
                  {
                    type: 'text',
                    text: 'We decided',
                  },
                ],
              },
            ],
          },
          {
            type: 'mysteryType',
            content: [
              {
                type: 'text',
                text: 'mystery text',
              },
            ],
          },
        ],
      };
      const expectedValidDoc: ADNode = {
        type: 'doc',
        content: [
          {
            type: 'decisionList',
            attrs: {
              localId: 'dl1',
            },
            content: [
              {
                type: 'decisionItem',
                attrs: {
                  localId: 'di1',
                  state: 'DECIDED',
                },
                content: [
                  {
                    type: 'text',
                    text: 'We decided',
                  },
                ],
              },
            ],
          },
          {
            type: 'unknownBlock',
            content: [
              {
                type: 'text',
                text: 'mystery text',
              },
            ],
          },
        ],
      };
      const originalCopy = JSON.parse(JSON.stringify(original));
      const newDoc = getValidDocument(original);
      // Ensure original is not mutated
      expect(originalCopy).toStrictEqual(original);
      expect(newDoc).toStrictEqual(expectedValidDoc);
    });

    it('should wrap top level text nodes to ensure the document is valid', () => {
      const original: ADDoc = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
          },
          {
            type: 'foo', // Should be wrapped
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'bar', // Should be a text node
              },
            ],
          },
        ],
      };
      const expectedValidDoc: ADNode = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: '[foo]',
              },
            ],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: '[bar]',
              },
            ],
          },
        ],
      };
      const newDoc = getValidDocument(original);
      expect(newDoc).toStrictEqual(expectedValidDoc);
    });
  });

  describe('Stage0', () => {
    it('should remove stage0 marks if flag is not explicitly set to "stage0"', () => {
      const original: ADDoc = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Hello World',
                marks: [
                  {
                    type: 'confluenceInlineComment',
                    attrs: {
                      reference: 'ref',
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      expect(getValidDocument(original)).toStrictEqual({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Hello World',
                marks: [],
              },
            ],
          },
        ],
      });
    });

    it('should keep stage0 marks if flag is explicitly set to "stage0"', () => {
      const original: ADDoc = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Hello World',
                marks: [
                  {
                    type: 'confluenceInlineComment',
                    attrs: {
                      reference: 'ref',
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      expect(
        getValidDocument(original, schema, ADFStages.STAGE_0),
      ).toStrictEqual({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Hello World',
                marks: [
                  {
                    type: 'confluenceInlineComment',
                    attrs: {
                      reference: 'ref',
                    },
                  },
                ],
              },
            ],
          },
        ],
      });
    });
  });
});
