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
      ],
    );
    let errorCallbackMock: jest.Mock;

    beforeEach(() => {
      errorCallbackMock = jest.fn();
    });

    afterEach(() => errorCallbackMock.mockRestore());

    it(
      'should invoke error callback with REDUNDANT_PROPERTIES error code ' +
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
            message: 'code: type not allowed here.',
            meta: undefined,
          }),
          expect.objectContaining({}),
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
        ' when we apply attribute to a mark which does not support any attributes' +
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
});
