import { validator } from '../../../validator';
import { ADFEntityMark } from '../../../types';

describe('validate Mark', () => {
  const validate = validator(
    ['doc', 'paragraph', 'text', 'placeholder'],
    ['unsupportedMark', 'link', 'em', 'strong', 'textColor'],
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
      'when we pass a mark which is valid but unsupported by the node',
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
});
