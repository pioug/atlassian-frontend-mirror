import { ADFEntity, Validate, ValidationError } from '@atlaskit/adf-utils';

import {
  DispatchAnalyticsEvent,
  validationErrorHandler,
  wrapWithUnsupported,
} from '../validate-using-spec';

const unsupportedNode: ADFEntity = {
  type: 'xyz',
  text: 'hello',
};

const unsupportedBlockWithContents: ADFEntity = {
  type: 'x',
  text: 'hello',
  attrs: { id: '4' },
  content: [
    {
      type: 'text',
      text: 'task',
      marks: [{ type: 'strong' }],
    },
  ],
};

const unsupportedInlineWithContents: any = {
  type: 'x',
  attrs: { id: '4', text: '@hey' },
};

const marks: string[] = ['indentation'];

const validateMock: jest.MockedFunction<Validate> = jest.fn((x) => ({
  valid: true,
  entity: x,
}));

describe('wrapWithUnsupported', () => {
  it('should wrap given node in unsupported block by default', () => {
    const wrapped = wrapWithUnsupported(unsupportedNode);
    expect(wrapped.type).toBe('unsupportedBlock');
    expect(wrapped.attrs).toEqual({
      originalValue: unsupportedNode,
    });
  });

  it('should wrap given node in unsupported block when type is block', () => {
    const wrapped = wrapWithUnsupported(unsupportedNode, 'block');
    expect(wrapped.type).toBe('unsupportedBlock');
    expect(wrapped.attrs).toEqual({
      originalValue: unsupportedNode,
    });
  });

  it('should preserve contents in unsupported block', () => {
    const wrapped = wrapWithUnsupported(unsupportedBlockWithContents);
    expect(wrapped.type).toBe('unsupportedBlock');
    expect(wrapped.attrs.originalValue).toEqual(unsupportedBlockWithContents);
  });

  it('should wrap given inline node in unsupported inline', () => {
    const wrapped = wrapWithUnsupported(unsupportedNode, 'inline');
    expect(wrapped.type).toBe('unsupportedInline');
    expect(wrapped.attrs).toEqual({
      originalValue: unsupportedNode,
    });
  });

  it('should preserve contents in unsupported inline', () => {
    const wrapped = wrapWithUnsupported(
      unsupportedInlineWithContents,
      'inline',
    );
    expect(wrapped.type).toBe('unsupportedInline');
    expect(wrapped.attrs.originalValue).toEqual(unsupportedInlineWithContents);
  });
});

describe('validationErrorHandler', () => {
  afterEach(() => {
    validateMock.mockClear();
  });

  const validationError: ValidationError = {
    code: 'INVALID_CONTENT',
    message: 'x: invalid content.',
  };

  it('should handle unsupported block', () => {
    const options = {
      allowUnsupportedBlock: true,
    };
    const result = validationErrorHandler(
      unsupportedNode,
      validationError,
      options,
      marks,
      validateMock,
    );
    expect(result).toBeDefined();
    expect(result && result.type).toBe('unsupportedBlock');
  });

  it('should handle unsupported inline', () => {
    const options = {
      allowUnsupportedInline: true,
    };
    const result = validationErrorHandler(
      unsupportedNode,
      validationError,
      options,
      marks,
      validateMock,
    );
    expect(result).toBeDefined();
    expect(result && result.type).toBe('unsupportedInline');
  });

  it('should not ignore maximum INVALID_CONTENT_LENGTH error', () => {
    const invalidNode = {
      type: 'mediaSingle',
      content: [
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: '1234',
            collection: 'SampleCollection',
          },
        },
        {
          type: 'caption',
          content: [
            {
              type: 'text',
              text: 'Hello World!',
            },
          ],
        },
      ],
    };
    const invalidContentLengthError: ValidationError = {
      code: 'INVALID_CONTENT_LENGTH',
      message: "'content' should have less than 1 child",
      meta: { length: 2, requiredLength: 1, type: 'maximum' },
    };
    const options = {
      allowUnsupportedBlock: true,
    };
    const result = validationErrorHandler(
      { ...invalidNode },
      invalidContentLengthError,
      options,
      marks,
      validateMock,
    );
    expect(result).toBeDefined();
    expect(result).toEqual({
      type: 'mediaSingle',
      content: [
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: '1234',
            collection: 'SampleCollection',
          },
        },
        {
          attrs: {
            originalValue: {
              content: [
                {
                  text: 'Hello World!',
                  type: 'text',
                },
              ],
              type: 'caption',
            },
          },
          type: 'unsupportedBlock',
        },
      ],
    });
  });

  it('should ignore unsupportedBlock in maximum INVALID_CONTENT_LENGTH error', () => {
    const invalidNode = {
      type: 'mediaSingle',
      content: [
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: '1234',
            collection: 'SampleCollection',
          },
        },
        {
          attrs: {
            originalValue: {
              content: [
                {
                  text: 'Hello World!',
                  type: 'text',
                },
              ],
              type: 'caption',
            },
          },
          type: 'unsupportedBlock',
        },
      ],
    };
    const invalidContentLengthError: ValidationError = {
      code: 'INVALID_CONTENT_LENGTH',
      message: "'content' should have less than 1 child",
      meta: { length: 2, requiredLength: 1, type: 'maximum' },
    };
    const options = {
      allowUnsupportedBlock: true,
    };
    const result = validationErrorHandler(
      { ...invalidNode },
      invalidContentLengthError,
      options,
      marks,
      validateMock,
    );
    expect(result).toBeDefined();
    expect(result).toEqual(invalidNode);
  });

  it('should validate all children in maximum INVALID_CONTENT_LENGTH error', () => {
    const invalidNode = {
      type: 'mediaSingle',
      content: [
        {
          type: 'x',
          text: 'hello',
        },
        {
          type: 'y',
          text: 'hello',
        },
        {
          type: 'z',
          text: 'hello',
        },
      ],
    };
    const invalidContentLengthError: ValidationError = {
      code: 'INVALID_CONTENT_LENGTH',
      message: "'content' should have less than 1 child",
      meta: { length: 3, requiredLength: 2, type: 'maximum' },
    };
    const options = {
      allowUnsupportedBlock: true,
    };
    validationErrorHandler(
      { ...invalidNode },
      invalidContentLengthError,
      options,
      marks,
      validateMock,
    );
    expect(validateMock).toHaveBeenCalledTimes(2);
    expect(validateMock.mock.calls[0][0]).toStrictEqual({
      type: 'x',
      text: 'hello',
    });
    expect(validateMock.mock.calls[1][0]).toStrictEqual({
      type: 'y',
      text: 'hello',
    });
  });

  describe('minimum INVALID_CONTENT_LENGTH error', () => {
    it('should wrap into unsupported node for LayoutSection', () => {
      const invalidNode = {
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
                content: [],
              },
            ],
          },
        ],
      };
      const expected = {
        type: 'layoutSection',
        content: [
          {
            type: 'unsupportedBlock',
            attrs: {
              originalValue: {
                type: 'layoutColumn',
                attrs: { width: 50 },
                content: [{ type: 'paragraph', content: [] }],
              },
            },
          },
        ],
      };
      const invalidContentLengthError: ValidationError = {
        code: 'INVALID_CONTENT_LENGTH',
        message: "'content' should have more than 1 child",
        meta: { length: 1, requiredLength: 2, type: 'minimum' },
      };
      const options = {
        allowUnsupportedBlock: true,
      };
      const result = validationErrorHandler(
        invalidNode,
        invalidContentLengthError,
        options,
        marks,
        validateMock,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(expected);
    });

    it('should not wrap a unsupported node in LayoutSection', () => {
      const invalidNode = {
        type: 'layoutSection',
        content: [
          {
            type: 'unsupportedBlock',
            attrs: {
              originalValue: {
                type: 'layoutColumn',
                attrs: { width: 50 },
                content: [{ type: 'paragraph', content: [] }],
              },
            },
          },
        ],
      };
      const invalidContentLengthError: ValidationError = {
        code: 'INVALID_CONTENT_LENGTH',
        message: "'content' should have more than 1 child",
        meta: { length: 1, requiredLength: 2, type: 'minimum' },
      };
      const options = {
        allowUnsupportedBlock: true,
      };
      const result = validationErrorHandler(
        invalidNode,
        invalidContentLengthError,
        options,
        marks,
        validateMock,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(invalidNode);
    });

    it('should wrap into unsupported node for BlockQuote', () => {
      const invalidNode = {
        type: 'blockquote',
        content: [],
      };
      const expected = {
        type: 'unsupportedBlock',
        attrs: {
          originalValue: {
            type: 'blockquote',
            content: [],
          },
        },
      };
      const invalidContentLengthError: ValidationError = {
        code: 'INVALID_CONTENT_LENGTH',
        message: "'content' should have more than 1 child",
        meta: { length: 1, requiredLength: 2, type: 'minimum' },
      };
      const options = {
        allowUnsupportedBlock: true,
      };
      const result = validationErrorHandler(
        invalidNode,
        invalidContentLengthError,
        options,
        marks,
        validateMock,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(expected);
    });

    it('should wrap into unsupported node for MediaSingle', () => {
      const invalidNode = {
        type: 'mediaSingle',
        content: [],
      };
      const expected = {
        type: 'unsupportedBlock',
        attrs: {
          originalValue: {
            type: 'mediaSingle',
            content: [],
          },
        },
      };
      const invalidContentLengthError: ValidationError = {
        code: 'INVALID_CONTENT_LENGTH',
        message: "'content' should have more than 1 child",
        meta: { length: 1, requiredLength: 2, type: 'minimum' },
      };
      const options = {
        allowUnsupportedBlock: true,
      };
      const result = validationErrorHandler(
        invalidNode,
        invalidContentLengthError,
        options,
        marks,
        validateMock,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(expected);
    });
  });

  it('should add empty content for paragraph with missing properties', () => {
    const paragraphNodeWithoutContent = { type: 'paragraph' };
    const error: ValidationError = {
      code: 'MISSING_PROPERTIES',
      message: 'missing properties error message',
    };
    const options = {
      allowUnsupportedInline: true,
    };

    const result = validationErrorHandler(
      paragraphNodeWithoutContent,
      error,
      options,
      marks,
      validateMock,
    );
    expect(result).toBeDefined();
    expect(result && result.type).toBe('paragraph');
    expect(result).toEqual({
      type: 'paragraph',
      content: [],
    });
  });

  it('should ignore the invalid node if no wrapping options are given', () => {
    const error: ValidationError = {
      code: 'INVALID_TYPE',
      message: 'xyz: type not allowed here',
    };
    const result = validationErrorHandler(
      unsupportedNode,
      error,
      {},
      [],
      validateMock,
    );
    expect(result).toEqual(unsupportedNode);
  });
});

describe('validationErrorHandler', () => {
  let dispatchAnalyticsEventMock: jest.Mock<DispatchAnalyticsEvent>;

  beforeEach(() => {
    dispatchAnalyticsEventMock = jest.fn();
  });

  afterEach(() => {
    dispatchAnalyticsEventMock.mockRestore();
    validateMock.mockClear();
  });

  it('should track the validation error if the unsupported contents are not wrapped', () => {
    const error: ValidationError = {
      code: 'INVALID_TYPE',
      message: 'xyz: type not allowed here',
    };
    validationErrorHandler(
      unsupportedNode,
      error,
      {},
      [],
      validateMock,
      dispatchAnalyticsEventMock,
    );

    expect(dispatchAnalyticsEventMock).toBeCalledWith(
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedUnhandled',
        attributes: {
          unsupportedNode: unsupportedNode,
          errorCode: 'INVALID_TYPE',
        },
        eventType: 'track',
      }),
    );
  });

  it('should not track if the contents are wrapped in unsupported block', () => {
    const error: ValidationError = {
      code: 'INVALID_TYPE',
      message: 'xyz: type not allowed here',
    };
    validationErrorHandler(
      unsupportedNode,
      error,
      {
        allowUnsupportedBlock: true,
      },
      [],
      validateMock,
      dispatchAnalyticsEventMock,
    );

    expect(dispatchAnalyticsEventMock).not.toHaveBeenCalled();
  });

  it('should not track if the contents are wrapped in unsupported inline', () => {
    const error: ValidationError = {
      code: 'INVALID_TYPE',
      message: 'xyz: type not allowed here',
    };
    validationErrorHandler(
      unsupportedNode,
      error,
      {
        allowUnsupportedInline: true,
      },
      [],
      validateMock,
      dispatchAnalyticsEventMock,
    );

    expect(dispatchAnalyticsEventMock).not.toHaveBeenCalled();
  });

  it('should not track if the contents are wrapped in unsupported mark', () => {
    const error: ValidationError = {
      code: 'INVALID_TYPE',
      message: 'xyz: type not allowed here',
    };
    validationErrorHandler(
      unsupportedNode,
      error,
      {
        isMark: true,
      },
      [],
      validateMock,
      dispatchAnalyticsEventMock,
    );

    expect(dispatchAnalyticsEventMock).not.toHaveBeenCalled();
  });

  it('should track invalid content length', () => {
    const nodeWithInvalidContentLength = {
      type: 'panel',
      content: [],
    };
    const error: ValidationError = {
      code: 'INVALID_CONTENT_LENGTH',
      message: 'invalid content length',
    };
    validationErrorHandler(
      nodeWithInvalidContentLength,
      error,
      {},
      [],
      validateMock,
      dispatchAnalyticsEventMock,
    );

    expect(dispatchAnalyticsEventMock).toBeCalledWith(
      expect.objectContaining({
        action: 'unsupportedContentEncountered',
        actionSubject: 'document',
        actionSubjectId: 'unsupportedUnhandled',
        attributes: {
          unsupportedNode: nodeWithInvalidContentLength,
          errorCode: 'INVALID_CONTENT_LENGTH',
        },
        eventType: 'track',
      }),
    );
  });
});
