import { validator } from '../../../validator';
import { ADFEntityMark } from '../../../types';

describe('validate Mark', () => {
  const validate = validator(
    [
      'doc',
      'paragraph',
      'text',
      'placeholder',
      'bulletList',
      'listItem',
      'codeBlock',
      'layoutColumn',
      'layoutSection',
    ],
    [
      'unsupportedMark',
      'link',
      'em',
      'strong',
      'textColor',
      'breakout',
      'indentation',
    ],
  );
  let errorCallbackMock: any;

  beforeEach(() => {
    errorCallbackMock = jest.fn();
  });

  afterEach(() => errorCallbackMock.mockRestore());

  it(
    'should invoke error callback with INVALID_CONTENT error code' +
      'when an unknown mark appears',
    () => {
      const unsupportedAdfMark = {
        type: 'unsupported',
        attrs: {
          color: '#6554c0',
        },
      };
      const initialEntity = {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Hello',
            marks: [
              {
                type: 'textColor',
                attrs: {
                  color: '#6554c0',
                },
              },
              unsupportedAdfMark,
            ],
          },
        ],
      };

      validate(initialEntity, errorCallbackMock);

      expect(errorCallbackMock).toHaveBeenCalledTimes(1);
      expect(errorCallbackMock).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          code: 'INVALID_CONTENT',
          message: 'unsupported: unsupported mark.',
          meta: unsupportedAdfMark,
        }),
        expect.objectContaining({
          allowUnsupportedBlock: false,
          allowUnsupportedInline: false,
          isMark: true,
        }),
      );
    },
  );

  it('should throw error when no error callback provided and unsupported mark is present', () => {
    const unsupportedAdfMark = {
      type: 'unsupported',
      attrs: {
        color: '#6554c0',
      },
    };

    const initialEntity = {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hello',
          marks: [
            {
              type: 'textColor',
              attrs: {
                color: '#6554c0',
              },
            },
            unsupportedAdfMark,
          ],
        },
      ],
    };

    const run = () => {
      validate(initialEntity);
    };
    expect(run).toThrowError('unsupported: unsupported mark.');
    expect(errorCallbackMock.mock.calls.length).toBe(0);
  });

  it(
    'should invoke error callback with REDUNDANT_MARKS error code' +
      'when mark not allowed',
    () => {
      const unsupportedAdfMark = {
        type: 'unsupported',
        attrs: {
          color: '#6554c0',
        },
      };
      const initialEntity = {
        type: 'paragraph',
        content: [
          {
            type: 'placeholder',
            attrs: {
              text: 'text',
            },
            marks: [unsupportedAdfMark],
          },
        ],
      };

      validate(initialEntity, errorCallbackMock);

      expect(errorCallbackMock).toHaveBeenCalledTimes(1);
      expect(errorCallbackMock).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          code: 'REDUNDANT_MARKS',
          message: 'unsupported: unsupported mark.',
          meta: unsupportedAdfMark,
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
    'should invoke error callback with REDUNDANT_MARKS error code' +
      'when we pass a mark which is valid but any marks are unsupported by the node',
    () => {
      const unsupportedAdfMark = {
        type: 'strong',
      };
      const initialEntity = {
        type: 'paragraph',
        content: [
          {
            type: 'placeholder',
            attrs: {
              text: 'text',
            },
            marks: [unsupportedAdfMark],
          },
        ],
      };
      validate(initialEntity, errorCallbackMock);
      expect(errorCallbackMock).toHaveBeenCalledTimes(1);
      expect(errorCallbackMock).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          code: 'REDUNDANT_MARKS',
          message: 'strong: unsupported mark.',
          meta: unsupportedAdfMark,
        }),
        expect.objectContaining({
          allowUnsupportedBlock: false,
          allowUnsupportedInline: false,
          isMark: true,
        }),
      );
    },
  );

  it('should remove any unsupported mark and return all supported marks when error callback is proivded', () => {
    const unsupportedAdfMark = {
      type: 'unsupported',
    };
    const supportedMark = {
      type: 'strong',
    };
    const initialEntity = {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Unsupported mark',
          marks: [unsupportedAdfMark, supportedMark],
        },
      ],
    };

    const result = validate(initialEntity, errorCallbackMock);

    let finalMarks = [] as Array<ADFEntityMark>;
    if (
      result.entity &&
      result.entity.content &&
      result.entity.content[0] &&
      result.entity.content[0].marks
    ) {
      finalMarks = result.entity.content[0].marks;
    }
    expect(finalMarks.length).toBe(1);
    expect(finalMarks[0]).toMatchObject(supportedMark);
  });

  it(
    'should make sure parent node and child node not supporting marks' +
      'and both containg invalid mark throw error',
    () => {
      const unsupportedParentAdfMark = {
        type: 'unsupportedParent',
      };
      const unSupportedChildAdfMark = {
        type: 'unsupportedChild',
      };
      const initialEntity = {
        type: 'panel',
        attrs: {
          panelType: 'info',
        },
        marks: [unsupportedParentAdfMark],
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'ghfhfhfhg',
                marks: [unSupportedChildAdfMark],
              },
            ],
          },
        ],
      };

      validate(initialEntity, errorCallbackMock);
      expect(errorCallbackMock).toHaveBeenCalledTimes(3);
      expect(errorCallbackMock).toHaveBeenNthCalledWith(
        3,
        expect.anything(),
        expect.objectContaining({
          code: 'REDUNDANT_MARKS',
          message: 'unsupportedParent: unsupported mark.',
          meta: unsupportedParentAdfMark,
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
          code: 'INVALID_CONTENT',
          message: 'unsupportedChild: unsupported mark.',
          meta: unSupportedChildAdfMark,
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
    'should return REDUNDANT_PROPERTIES error with unsupportedContent;' +
      'when we have a redundant mark with redundant properties',
    () => {
      const redundantProps = ['marks', 'unknownProp'];
      const initialEntity = {
        type: 'panel',
        attrs: {
          panelType: 'success',
        },
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Hello',
              },
            ],
          },
        ],
        marks: [
          {
            type: 'unknown',
          },
        ],
        unknownProp: true,
      };
      validate(initialEntity, errorCallbackMock);
      expect(errorCallbackMock).toHaveBeenCalledTimes(1);
      expect(errorCallbackMock).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          code: 'REDUNDANT_PROPERTIES',
          message: `panel: redundant props found: ${redundantProps.join(
            ', ',
          )}.`,
          meta: { props: redundantProps },
        }),
        {},
      );
    },
  );

  it(
    'should return REDUNDANT_MARKS error in list and list items;' +
      'when we have unknown marks or marks which are not supported by node',
    () => {
      const initialEntity = {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Para',
                  },
                ],
              },
            ],
            marks: [
              {
                type: 'breakout',
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'codeBlock',
                attrs: {},
              },
            ],
          },
        ],
        marks: [
          {
            type: 'unknown',
          },
        ],
      };
      validate(initialEntity, errorCallbackMock);
      expect(errorCallbackMock).toHaveBeenCalledTimes(2);
      expect(errorCallbackMock).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        expect.objectContaining({
          code: 'REDUNDANT_MARKS',
          message: 'unknown: unsupported mark.',
          meta: { type: 'unknown' },
        }),
        expect.objectContaining({
          allowUnsupportedBlock: false,
          allowUnsupportedInline: false,
          isMark: true,
        }),
      );
      expect(errorCallbackMock).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        expect.objectContaining({
          code: 'REDUNDANT_MARKS',
          message: 'breakout: unsupported mark.',
          meta: { type: 'breakout' },
        }),
        expect.objectContaining({
          allowUnsupportedBlock: false,
          allowUnsupportedInline: false,
          isMark: true,
        }),
      );
    },
  );

  it('should not drop a valid mark for a node with single validation spec', () => {
    const initialEntity = {
      type: 'layoutSection',
      content: [
        {
          type: 'layoutColumn',
          attrs: {
            width: 50,
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Column1',
                },
              ],
            },
          ],
        },
        {
          type: 'layoutColumn',
          attrs: {
            width: 50,
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Column2',
                },
              ],
            },
          ],
        },
      ],
      marks: [
        {
          type: 'breakout',
          attrs: {
            mode: 'wide',
          },
        },
      ],
    };
    const validationResult = validate(initialEntity, errorCallbackMock);
    expect(errorCallbackMock).not.toHaveBeenCalled();
    expect(validationResult.valid).toBeTruthy();
    expect(validationResult.entity).toMatchObject(initialEntity);
  });

  it(
    'should return valid node, when we have multiple validator specs ' +
      'and one of them is valid for given mark',
    () => {
      const initialEntity = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Indented Para',
              },
            ],
            marks: [
              {
                type: 'indentation',
                attrs: {
                  level: 2,
                },
              },
            ],
          },
        ],
      };
      const validationResult = validate(initialEntity, errorCallbackMock);
      expect(errorCallbackMock).toHaveBeenCalledTimes(2);
      expect(validationResult.valid).toBeTruthy();
      expect(validationResult.entity).toMatchObject(initialEntity);
    },
  );
});
