import { validator } from '../../../validator';

describe('validate Attribute', () => {
  describe('at Mark Level', () => {
    const validate = validator(
      ['doc', 'paragraph', 'text', 'placeholder'],
      [
        'unsupportedMark',
        'link',
        'em',
        'strong',
        'textColor',
        'subsup',
        'code',
        'strike',
        'alignment',
      ],
    );
    let errorCallbackMock: jest.Mock;

    beforeEach(() => {
      errorCallbackMock = jest.fn();
    });

    afterEach(() => errorCallbackMock.mockRestore());

    it(
      'should invoke error callback with REDUNDANT_ATTRIBUTES error code ' +
        'when unknown attribute appears along with known attribute(s)',
      () => {
        const unsupportedMarkAttribute = {
          type: 'textColor',
          attrs: {
            color: '#ff5630',
            bgcolor: '#6554c0',
          },
        };
        const initialEntity = {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello',
              marks: [unsupportedMarkAttribute],
            },
          ],
        };

        validate(initialEntity, errorCallbackMock);
        expect(errorCallbackMock).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            code: 'REDUNDANT_ATTRIBUTES',
            message: 'redundant attributes found: bgcolor.',
            meta: unsupportedMarkAttribute,
          }),
          expect.objectContaining({
            allowUnsupportedBlock: false,
            allowUnsupportedInline: false,
            isMark: true,
          }),
        );
      },
    );

    it(
      'should invoke error callback with INVALID_ATTRIBUTES failed error code ' +
        'when know attribute appears with unsupported value',
      () => {
        const unsupportedMarkAttribute = {
          type: 'textColor',
          attrs: {
            color: '12',
          },
        };
        const initialEntity = {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello',
              marks: [unsupportedMarkAttribute],
            },
          ],
        };

        validate(initialEntity, errorCallbackMock);

        expect(errorCallbackMock).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            code: 'INVALID_ATTRIBUTES',
            message: `textColor: 'attrs' validation failed.`,
            meta: unsupportedMarkAttribute,
          }),
          expect.objectContaining({
            allowUnsupportedBlock: false,
            allowUnsupportedInline: false,
            isMark: true,
          }),
        );
      },
    );

    it(
      'should invoke error callback with INVALID_ATTRIBUTES failed error code ' +
        'when required attribute not provided',
      () => {
        const unsupportedMarkAttribute = {
          type: 'textColor',
          attrs: {},
        };
        const initialEntity = {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello',
              marks: [unsupportedMarkAttribute],
            },
          ],
        };

        validate(initialEntity, errorCallbackMock);

        expect(errorCallbackMock).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            code: 'INVALID_ATTRIBUTES',
            message: `textColor: 'attrs' validation failed.`,
            meta: unsupportedMarkAttribute,
          }),
          expect.objectContaining({
            allowUnsupportedBlock: false,
            allowUnsupportedInline: false,
            isMark: true,
          }),
        );
      },
    );

    it(
      'should make sure multiple marks containing' +
        ' invalid attributes throws errors',
      () => {
        const unsupportedMarkAttribute1 = {
          type: 'textColor',
          attrs: {
            color: 'red',
          },
        };
        const unsupportedMarkAttribute2 = {
          type: 'subsup',
          attrs: {
            type: 'someValue',
          },
        };
        const initialEntity = {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: "FAB-1520 UI: Poor man's search",
                  marks: [unsupportedMarkAttribute1, unsupportedMarkAttribute2],
                },
              ],
            },
          ],
        };
        validate(initialEntity, errorCallbackMock);
        expect(errorCallbackMock).toHaveBeenNthCalledWith(
          1,
          expect.anything(),
          expect.objectContaining({
            code: 'INVALID_ATTRIBUTES',
            message: "textColor: 'attrs' validation failed.",
            meta: unsupportedMarkAttribute1,
          }),
          expect.objectContaining({
            allowUnsupportedBlock: false,
            allowUnsupportedInline: false,
            isMark: true,
          }),
        );
        expect(errorCallbackMock).toHaveBeenNthCalledWith(
          2,
          expect.anything(),
          expect.objectContaining({
            code: 'INVALID_ATTRIBUTES',
            message: "subsup: 'attrs' validation failed.",
            meta: unsupportedMarkAttribute2,
          }),
          expect.objectContaining({
            allowUnsupportedBlock: false,
            allowUnsupportedInline: false,
            isMark: true,
          }),
        );
      },
    );

    it(
      'should throw error when no error callback provided ' +
        'and invalid attribute is present',
      () => {
        const unsupportedMarkAttribute = {
          type: 'textColor',
          attrs: {
            bgcolor: '#6554c0',
          },
        };
        const initialEntity = {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello',
              marks: [unsupportedMarkAttribute],
            },
          ],
        };
        const run = () => {
          validate(initialEntity);
        };
        expect(run).toThrowError(`textColor: 'attrs' validation failed.`);
      },
    );

    it(
      'should throw error when no error callback provided and ' +
        'redundant attribute is present',
      () => {
        const unsupportedMarkAttribute = {
          type: 'textColor',
          attrs: {
            color: '#6554c0',
            bgcolor: '#6554c0',
          },
        };
        const initialEntity = {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello',
              marks: [unsupportedMarkAttribute],
            },
          ],
        };
        const run = () => {
          validate(initialEntity);
        };
        expect(run).toThrowError(`redundant attributes found: bgcolor.`);
      },
    );

    it(
      'should invoke error callback with  erorr code as "REDUNDANT_ATTRIBUTES" ' +
        ' when we apply attribute to a mark which does not support any attributes' +
        'and the node has multiple specs',
      () => {
        const markWithAttribute = {
          type: 'code',
          attrs: {
            bg: 'red',
          },
        };
        const entity = {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello',
              marks: [markWithAttribute],
            },
          ],
        };

        validate(entity, errorCallbackMock);
        expect(errorCallbackMock).toHaveBeenCalledTimes(2);
        expect(errorCallbackMock).toHaveBeenNthCalledWith(
          1,
          expect.anything(),
          expect.objectContaining({
            code: 'INVALID_TYPE',
            message: 'code: unsupported mark.',
            meta: markWithAttribute,
          }),
          expect.objectContaining({
            allowUnsupportedBlock: false,
            allowUnsupportedInline: false,
            isMark: true,
          }),
        );
        expect(errorCallbackMock).toHaveBeenNthCalledWith(
          2,
          expect.anything(),
          expect.objectContaining({
            code: 'REDUNDANT_ATTRIBUTES',
            message: 'redundant attributes found: bg.',
            meta: markWithAttribute,
          }),
          expect.objectContaining({
            allowUnsupportedBlock: false,
            allowUnsupportedInline: false,
            isMark: true,
          }),
        );
      },
    );

    it(
      'should invoke error callback with  erorr code as "REDUNDANT_ATTRIBUTES" ' +
        'when we apply attribute to a mark which does not support any attributes' +
        'and the node has multiple specs with multiple marks',
      () => {
        const strongMarkWithAttribute = {
          type: 'strong',
          attrs: {
            bgStrong: 'red',
          },
        };
        const strikeMarkWithAttribute = {
          type: 'strike',
          attrs: {
            bg: 'red',
          },
        };
        const entity = {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello',
              marks: [strongMarkWithAttribute, strikeMarkWithAttribute],
            },
          ],
        };

        validate(entity, errorCallbackMock);
        expect(errorCallbackMock).toHaveBeenNthCalledWith(
          1,
          expect.anything(),
          expect.objectContaining({
            code: 'REDUNDANT_ATTRIBUTES',
            message: 'redundant attributes found: bgStrong.',
            meta: strongMarkWithAttribute,
          }),
          expect.objectContaining({}),
        );
        expect(errorCallbackMock).toHaveBeenNthCalledWith(
          2,
          expect.anything(),
          expect.objectContaining({
            code: 'REDUNDANT_ATTRIBUTES',
            message: 'redundant attributes found: bg.',
            meta: strikeMarkWithAttribute,
          }),
          expect.objectContaining({
            allowUnsupportedBlock: false,
            allowUnsupportedInline: false,
            isMark: true,
          }),
        );
      },
    );
  });

  describe('at Node Level', () => {
    const validate = validator([
      'doc',
      'paragraph',
      'status',
      'mention',
      'hardBreak',
      'taskList',
      'taskItem',
      'blockquote',
    ]);

    let errorCallbackMock: jest.Mock;

    beforeEach(() => {
      errorCallbackMock = jest.fn();
    });

    afterEach(() => errorCallbackMock.mockRestore());

    it(`should invoke error callback with UNSUPPORTED_ATTRIBUTES error code when node
        does not support any attribute and an attribute property is passed`, () => {
      const unsupportedNodeAttribute = {
        some: 'value',
      };

      const initialEntity = {
        type: 'blockquote',
        content: [
          {
            type: 'paragraph',
            content: [],
          },
        ],
        attrs: unsupportedNodeAttribute,
      };

      validate(initialEntity, errorCallbackMock);
      expect(errorCallbackMock).toHaveBeenCalledTimes(1);
      expect(errorCallbackMock).toHaveBeenCalledWith(
        { type: 'blockquote' },
        expect.objectContaining({
          code: 'UNSUPPORTED_ATTRIBUTES',
          message: `blockquote: 'attrs' validation failed.`,
          meta: { some: 'value' },
        }),
        expect.objectContaining({
          allowUnsupportedBlock: false,
          allowUnsupportedInline: false,
          isMark: false,
          isNodeAttribute: true,
        }),
      );
    });

    it(`should invoke error callback with UNSUPPORTED_ATTRIBUTES error code
      when unknown attribute appears along with known attribute(s) and node type is Status`, () => {
      const unsupportedNodeAttribute = {
        text: 'Hello',
        color: 'neutral',
        localId: '156a150d-f02c-4223-a7a2-0592e830be6f',
        style: '',
        invalidAttribute: 'invalidAttributeValue',
      };

      const initialEntity = {
        type: 'paragraph',
        content: [
          {
            type: 'status',
            attrs: unsupportedNodeAttribute,
          },
        ],
      };

      validate(initialEntity, errorCallbackMock);

      expect(errorCallbackMock).toHaveBeenCalledWith(
        { type: 'status' },
        expect.objectContaining({
          code: 'UNSUPPORTED_ATTRIBUTES',
          message: `status: 'attrs' validation failed.`,
          meta: { invalidAttribute: 'invalidAttributeValue' },
        }),
        expect.objectContaining({
          allowUnsupportedBlock: false,
          allowUnsupportedInline: false,
          isMark: false,
          isNodeAttribute: true,
        }),
      );
    });

    it(`should invoke error callback with UNSUPPORTED_ATTRIBUTES error code
      when an private attribute appears along with known attribute(s) and node type is Status`, () => {
      const unsupportedNodeAttribute = {
        text: 'Hello',
        color: 'neutral',
        localId: '156a150d-f02c-4223-a7a2-0592e830be6f',
        style: '',
        __invalidPrivateAttribute: 'invalidPrivateAttributeValue',
      };

      const initialEntity = {
        type: 'paragraph',
        content: [
          {
            type: 'status',
            attrs: unsupportedNodeAttribute,
          },
        ],
      };

      validate(initialEntity, errorCallbackMock);

      expect(errorCallbackMock).toHaveBeenCalledWith(
        { type: 'status' },
        expect.objectContaining({
          code: 'UNSUPPORTED_ATTRIBUTES',
          message: `status: 'attrs' validation failed.`,
          meta: { __invalidPrivateAttribute: 'invalidPrivateAttributeValue' },
        }),
        expect.objectContaining({
          allowUnsupportedBlock: false,
          allowUnsupportedInline: false,
          isMark: false,
          isNodeAttribute: true,
        }),
      );
    });

    it(`should invoke error callback with UNSUPPORTED_ATTRIBUTES error code
      when unknown attribute appears along with known attribute(s) and node type is Mention`, () => {
      const initialEntity = {
        type: 'paragraph',
        content: [
          {
            type: 'mention',
            attrs: {
              id: 'test-id',
              text: 'Test User',
              invalidAttribute: 'invalidAttributeValue',
            },
          },
        ],
      };

      validate(initialEntity, errorCallbackMock);

      expect(errorCallbackMock).toHaveBeenCalledWith(
        { type: 'mention' },
        expect.objectContaining({
          code: 'UNSUPPORTED_ATTRIBUTES',
          message: `mention: 'attrs' validation failed.`,
          meta: { invalidAttribute: 'invalidAttributeValue' },
        }),
        expect.objectContaining({
          allowUnsupportedBlock: false,
          allowUnsupportedInline: false,
          isMark: false,
          isNodeAttribute: true,
        }),
      );
    });

    it(`should invoke error callback with UNSUPPORTED_ATTRIBUTES error code
      when unknown attribute appears along with known attribute(s) and node type is Heading`, () => {
      const initialEntity = {
        type: 'heading',
        content: [
          {
            type: 'text',
            text: 'Heading',
          },
        ],
        attrs: {
          level: 1,
          invalidAttribute: 'invalidAttributeValue',
        },
      };

      validate(initialEntity, errorCallbackMock);

      expect(errorCallbackMock).toHaveBeenCalledWith(
        { type: 'heading' },
        expect.objectContaining({
          code: 'UNSUPPORTED_ATTRIBUTES',
          message: `heading: 'attrs' validation failed.`,
          meta: { invalidAttribute: 'invalidAttributeValue' },
        }),
        expect.objectContaining({
          allowUnsupportedBlock: false,
          allowUnsupportedInline: false,
          isMark: false,
          isNodeAttribute: true,
        }),
      );
    });

    it(`should invoke error callback with UNSUPPORTED_ATTRIBUTES failed error code
      when a valid attribute appears with an unsupported value`, () => {
      const initialEntity = {
        type: 'paragraph',
        content: [
          {
            type: 'mention',
            attrs: {
              id: '0',
              text: '@Carolyn',
              accessLevel: 123,
            },
          },
        ],
      };

      validate(initialEntity, errorCallbackMock);

      expect(errorCallbackMock).toHaveBeenCalledWith(
        { type: 'mention' },
        expect.objectContaining({
          code: 'UNSUPPORTED_ATTRIBUTES',
          message: `mention: 'attrs' validation failed.`,
          meta: { accessLevel: 123 },
        }),
        expect.objectContaining({
          allowUnsupportedBlock: false,
          allowUnsupportedInline: false,
          isMark: false,
          isNodeAttribute: true,
        }),
      );
    });

    it(`should invoke error callback with UNSUPPORTED_ATTRIBUTES failed error code
      when mention node appears with unsupported "userType" value`, () => {
      const initialEntity = {
        type: 'paragraph',
        content: [
          {
            type: 'mention',
            attrs: {
              id: '0',
              text: '@Carolyn',
              userType: 'SCIENTIST',
            },
          },
        ],
      };

      validate(initialEntity, errorCallbackMock);

      expect(errorCallbackMock).toHaveBeenCalledWith(
        { type: 'mention' },
        expect.objectContaining({
          code: 'UNSUPPORTED_ATTRIBUTES',
          message: `mention: 'attrs' validation failed.`,
          meta: { userType: 'SCIENTIST' },
        }),
        expect.objectContaining({
          allowUnsupportedBlock: false,
          allowUnsupportedInline: false,
          isMark: false,
          isNodeAttribute: true,
        }),
      );
    });

    it(`should invoke error callback with UNSUPPORTED_ATTRIBUTES failed error code
      when hardbreak node appears with unsupported "text" value`, () => {
      const initialEntity = {
        type: 'paragraph',
        content: [
          {
            type: 'hardBreak',
            attrs: {
              text: 'foo',
            },
          },
        ],
      };

      validate(initialEntity, errorCallbackMock);

      expect(errorCallbackMock).toHaveBeenCalledWith(
        { type: 'hardBreak' },
        expect.objectContaining({
          code: 'UNSUPPORTED_ATTRIBUTES',
          message: `hardBreak: 'attrs' validation failed.`,
          meta: { text: 'foo' },
        }),
        expect.objectContaining({
          allowUnsupportedBlock: false,
          allowUnsupportedInline: false,
          isMark: false,
          isNodeAttribute: true,
        }),
      );
    });

    it(`should invoke error callback with UNSUPPORTED_ATTRIBUTES failed error code
    when a required attribute has an invalid value`, () => {
      const initialEntity = {
        type: 'paragraph',
        content: [
          {
            type: 'mention',
            attrs: {
              id: 0,
              text: '@Carolyn',
              userType: 'DEFAULT',
            },
          },
        ],
      };

      validate(initialEntity, errorCallbackMock);

      expect(errorCallbackMock).toHaveBeenCalledWith(
        { type: 'mention' },
        expect.objectContaining({
          code: 'UNSUPPORTED_ATTRIBUTES',
          message: `mention: 'attrs' validation failed.`,
          meta: { id: 0 },
        }),
        expect.objectContaining({
          allowUnsupportedBlock: false,
          allowUnsupportedInline: false,
          isMark: false,
          isNodeAttribute: true,
        }),
      );
    });

    it(`should throw error callback UNSUPPORTED_ATTRIBUTES and REDUNDANT_MARKS
      when an unknown node attribute and an unknown mark are present`, () => {
      const initialEntity = {
        type: 'taskList',
        attrs: {
          localId: '9b94758a-ed78-4cf2-b4da-eada3c7bf8fb',
        },
        content: [
          {
            type: 'taskItem',
            attrs: {
              localId: '9689c8bc-2466-4a4c-839f-ee139283a84c',
              state: 'TODO',
              unknownAttr: 'unknownAttrValue',
            },
            marks: [{ type: 'unknownMark' }],
          },
        ],
      };

      validate(initialEntity, errorCallbackMock);

      expect(errorCallbackMock).toHaveBeenNthCalledWith(
        1,
        { type: 'taskItem' },
        expect.objectContaining({
          code: 'UNSUPPORTED_ATTRIBUTES',
          message: `taskItem: 'attrs' validation failed.`,
          meta: { unknownAttr: 'unknownAttrValue' },
        }),
        expect.objectContaining({
          allowUnsupportedBlock: false,
          allowUnsupportedInline: false,
          isMark: false,
          isNodeAttribute: true,
        }),
      );

      expect(errorCallbackMock).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        expect.objectContaining({
          code: 'REDUNDANT_MARKS',
          message: 'unknownMark: unsupported mark.',
          meta: { type: 'unknownMark' },
        }),
        expect.objectContaining({
          allowUnsupportedBlock: false,
          allowUnsupportedInline: false,
          isMark: true,
        }),
      );
    });

    it(`should throw error callback UNSUPPORTED_ATTRIBUTES when an unknown node attribute is
    added to codeBlock with breakout marks`, () => {
      const initialEntity = {
        type: 'codeBlock',
        attrs: {
          language: 'javascript',
          unknownAttr: 'unknownAttrValue',
        },
        marks: [
          {
            type: 'breakout',
            attrs: {
              mode: 'wide',
            },
          },
        ],
      };

      validate(initialEntity, errorCallbackMock);

      expect(errorCallbackMock).toHaveBeenCalledWith(
        { type: 'codeBlock' },
        expect.objectContaining({
          code: 'UNSUPPORTED_ATTRIBUTES',
          message: `codeBlock: 'attrs' validation failed.`,
          meta: { unknownAttr: 'unknownAttrValue' },
        }),
        expect.objectContaining({
          allowUnsupportedBlock: false,
          allowUnsupportedInline: false,
          isMark: false,
          isNodeAttribute: true,
        }),
      );
    });
  });
});
