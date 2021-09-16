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
      'orderedList',
      'taskList',
      'taskItem',
    ],
    [
      'unsupportedMark',
      'link',
      'em',
      'strong',
      'textColor',
      'breakout',
      'indentation',
      'alignment',
      'underline',
      'code',
      'annotation',
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
      expect(errorCallbackMock).toHaveBeenNthCalledWith(
        1,
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

  // Single Spec

  // NOTE: Currently there is no other single spec that supports mark. Need to unskip when
  // we move single column from `stage-0` to `full`.
  it.skip('should not drop a valid mark for a node with single validation spec', () => {
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
    'should throw INVALID_TYPE error, when a known not supported marks are' +
      ', applied to a node with single spec',
    () => {
      const knownUnsupportedADFMark1 = {
        type: 'alignment',
      };
      const knownUnsupportedADFMark2 = {
        type: 'textColor',
      };
      const initialEntity = {
        type: 'doc',
        version: 1,
        content: [
          {
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
            marks: [knownUnsupportedADFMark1, knownUnsupportedADFMark2],
          },
        ],
      };
      const validationResult = validate(initialEntity, errorCallbackMock);
      expect(errorCallbackMock).toHaveBeenCalledTimes(4);
      expect(validationResult.valid).toBeTruthy();
      expect(errorCallbackMock).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        expect.objectContaining({
          code: 'INVALID_TYPE',
          message: 'alignment: unsupported mark.',
          meta: knownUnsupportedADFMark1,
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
          code: 'INVALID_TYPE',
          message: 'textColor: unsupported mark.',
          meta: knownUnsupportedADFMark2,
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
    'should throw INVALID_TYPE error, when a known not supported mark and an unknown mark is ' +
      'applied to a node with single spec',
    () => {
      const knownUnsupportedADFMark = {
        type: 'alignment',
      };
      const unknownMark = {
        type: 'unknownMark',
      };
      const initialEntity = {
        type: 'doc',
        version: 1,
        content: [
          {
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
            marks: [knownUnsupportedADFMark, unknownMark],
          },
        ],
      };
      const validationResult = validate(initialEntity, errorCallbackMock);
      expect(errorCallbackMock).toHaveBeenCalledTimes(4);
      expect(validationResult.valid).toBeTruthy();
      expect(errorCallbackMock).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        expect.objectContaining({
          code: 'INVALID_TYPE',
          message: 'alignment: unsupported mark.',
          meta: knownUnsupportedADFMark,
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
          message: 'unknownMark: unsupported mark.',
          meta: unknownMark,
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
    'should throw INVALID_TYPE error, when a known not supported mark and a valid mark is' +
      ', applied to a node with single spec',
    () => {
      const initialEntity = {
        version: 1,
        type: 'doc',
        content: [
          {
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
            marks: [
              {
                type: 'alignment',
              },
              {
                type: 'breakout',
                attrs: {
                  mode: 'wide',
                },
              },
            ],
          },
        ],
      };
      const validationResult = validate(initialEntity, errorCallbackMock);
      expect(errorCallbackMock).toHaveBeenCalledTimes(1);
      expect(validationResult.valid).toBeTruthy();
      expect(errorCallbackMock).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        expect.objectContaining({
          code: 'INVALID_TYPE',
          message: 'alignment: unsupported mark.',
          meta: { type: 'alignment' },
        }),
        expect.objectContaining({
          allowUnsupportedBlock: false,
          allowUnsupportedInline: false,
          isMark: true,
        }),
      );
    },
  );

  // MultiSpec

  it(`should throw INVALID_TYPE error for specs which does not support the mark and should not
       throw error for spec which supports it, when a known and valid mark is applied
      to a node with multple specs`, () => {
    const initialEntity = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Some Text',
            },
          ],
          marks: [
            {
              type: 'indentation',
              attrs: {
                level: 1,
              },
            },
          ],
        },
      ],
    };

    validate(initialEntity, errorCallbackMock);
    expect(errorCallbackMock).not.toHaveBeenCalledWith();
  });

  it(`should throw INVALID_TYPE error for specs which does not support the mark and should not
       throw error for spec which supports it, when a known and valid mark is applied along
       with known but invalid mark to a node with multple specs.`, () => {
    const initialEntity = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Some Text',
            },
          ],
          marks: [
            {
              type: 'breakout',
            },
            {
              type: 'indentation',
              attrs: {
                level: 1,
              },
            },
          ],
        },
      ],
    };

    validate(initialEntity, errorCallbackMock);
    expect(errorCallbackMock).toHaveBeenCalledTimes(5);
    const expectedMetaBreakout = { type: 'breakout' };
    const ecpectedMetaIndentation = {
      attrs: { level: 1 },
      type: 'indentation',
    };
    expect(errorCallbackMock).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      expect.objectContaining({
        code: 'INVALID_TYPE',
        message: 'breakout: unsupported mark.',
        meta: expectedMetaBreakout,
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
        code: 'INVALID_TYPE',
        message: 'indentation: unsupported mark.',
        meta: ecpectedMetaIndentation,
      }),
      expect.objectContaining({
        allowUnsupportedBlock: false,
        allowUnsupportedInline: false,
        isMark: true,
      }),
    );
    expect(errorCallbackMock).toHaveBeenNthCalledWith(
      3,
      expect.anything(),
      expect.objectContaining({
        code: 'INVALID_TYPE',
        message: 'breakout: unsupported mark.',
        meta: expectedMetaBreakout,
      }),
      expect.objectContaining({
        allowUnsupportedBlock: false,
        allowUnsupportedInline: false,
        isMark: true,
      }),
    );
    expect(errorCallbackMock).toHaveBeenNthCalledWith(
      4,
      expect.anything(),
      expect.objectContaining({
        code: 'INVALID_TYPE',
        message: 'indentation: unsupported mark.',
        meta: ecpectedMetaIndentation,
      }),
      expect.objectContaining({
        allowUnsupportedBlock: false,
        allowUnsupportedInline: false,
        isMark: true,
      }),
    );
    expect(errorCallbackMock).toHaveBeenNthCalledWith(
      5,
      expect.anything(),
      expect.objectContaining({
        code: 'INVALID_TYPE',
        message: 'breakout: unsupported mark.',
        meta: expectedMetaBreakout,
      }),
      expect.objectContaining({
        allowUnsupportedBlock: false,
        allowUnsupportedInline: false,
        isMark: true,
      }),
    );
  });

  it(`should throw INVALID_TYPE error for specs which does not support the mark and should not
       throw error for spec which supports it, when a known and valid mark is applied along
       with unknown mark to a node with multple specs.`, () => {
    const initialEntity = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Some Text',
            },
          ],
          marks: [
            {
              type: 'unknownMark',
            },
            {
              type: 'alignment',
              attrs: {
                align: 'center',
              },
            },
          ],
        },
      ],
    };

    validate(initialEntity, errorCallbackMock);
    expect(errorCallbackMock).toHaveBeenCalledTimes(3);
    const expectedMetaBreakout = { type: 'unknownMark' };
    const ecpectedMetaIndentation = {
      attrs: { align: 'center' },
      type: 'alignment',
    };
    expect(errorCallbackMock).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      expect.objectContaining({
        code: 'INVALID_CONTENT',
        message: 'unknownMark: unsupported mark.',
        meta: expectedMetaBreakout,
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
        code: 'INVALID_TYPE',
        message: 'alignment: unsupported mark.',
        meta: ecpectedMetaIndentation,
      }),
      expect.objectContaining({
        allowUnsupportedBlock: false,
        allowUnsupportedInline: false,
        isMark: true,
      }),
    );
    expect(errorCallbackMock).toHaveBeenNthCalledWith(
      3,
      expect.anything(),
      expect.objectContaining({
        code: 'INVALID_CONTENT',
        message: 'unknownMark: unsupported mark.',
        meta: expectedMetaBreakout,
      }),
      expect.objectContaining({
        allowUnsupportedBlock: false,
        allowUnsupportedInline: false,
        isMark: true,
      }),
    );
  });

  it(
    `should throw INVALID_TYPE error for all the available specs, when a known but invalid ` +
      `mark is applied to a node with multple specs and wrap the known mark in unsupportedMark.`,
    () => {
      const initialEntity = {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Some Text',
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
          },
        ],
      };

      validate(initialEntity, errorCallbackMock);
      expect(errorCallbackMock).toHaveBeenCalledTimes(3);
      const expectedMeta = { attrs: { mode: 'wide' }, type: 'breakout' };
      expect(errorCallbackMock).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        expect.objectContaining({
          code: 'INVALID_TYPE',
          message: 'breakout: unsupported mark.',
          meta: expectedMeta,
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
          code: 'INVALID_TYPE',
          message: 'breakout: unsupported mark.',
          meta: expectedMeta,
        }),
        expect.objectContaining({
          allowUnsupportedBlock: false,
          allowUnsupportedInline: false,
          isMark: true,
        }),
      );
      expect(errorCallbackMock).toHaveBeenNthCalledWith(
        3,
        expect.anything(),
        expect.objectContaining({
          code: 'INVALID_TYPE',
          message: 'breakout: unsupported mark.',
          meta: expectedMeta,
        }),
        expect.objectContaining({
          allowUnsupportedBlock: false,
          allowUnsupportedInline: false,
          isMark: true,
        }),
      );
    },
  );

  it(`should wrap unknown mark in unsupportedMark, when a unknwon
      mark is applied to a node with multple specs.`, () => {
    const initialEntity = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Some Text',
            },
          ],
          marks: [
            {
              type: 'unknownMark',
            },
          ],
        },
      ],
    };

    validate(initialEntity, errorCallbackMock);
    expect(errorCallbackMock).toHaveBeenCalledTimes(3);
    const expectedMeta = { type: 'unknownMark' };
    expect(errorCallbackMock).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      expect.objectContaining({
        code: 'INVALID_CONTENT',
        message: 'unknownMark: unsupported mark.',
        meta: expectedMeta,
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
        message: 'unknownMark: unsupported mark.',
        meta: expectedMeta,
      }),
      expect.objectContaining({
        allowUnsupportedBlock: false,
        allowUnsupportedInline: false,
        isMark: true,
      }),
    );
    expect(errorCallbackMock).toHaveBeenNthCalledWith(
      3,
      expect.anything(),
      expect.objectContaining({
        code: 'INVALID_CONTENT',
        message: 'unknownMark: unsupported mark.',
        meta: expectedMeta,
      }),
      expect.objectContaining({
        allowUnsupportedBlock: false,
        allowUnsupportedInline: false,
        isMark: true,
      }),
    );
  });

  it(`should throw INVALID_TYPE error for specs which does not support the mark and should not
      throw error for spec which supports it, when a known and valid mark(s) are applied along
      with unknown mark(s) to a node with multple specs. unknown mark(s) should be wrapped in
      unsupportedMark's`, () => {
    const unknownFontSize = {
      type: 'fontSize',
      attrs: {
        mode: 'wide',
      },
    };
    const unknownBackground = {
      type: 'background',
      attrs: {
        mode: 'wide',
      },
    };
    const alignment = {
      type: 'alignment',
      attrs: {
        align: 'center',
      },
    };

    const initialEntity = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Some Text',
            },
          ],
          marks: [alignment, unknownBackground, unknownFontSize],
        },
      ],
    };

    validate(initialEntity, errorCallbackMock);
    expect(errorCallbackMock).toHaveBeenCalledTimes(5);
    expect(errorCallbackMock).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      expect.objectContaining({
        code: 'INVALID_TYPE',
        message: 'alignment: unsupported mark.',
        meta: alignment,
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
        message: 'background: unsupported mark.',
        meta: unknownBackground,
      }),
      expect.objectContaining({
        allowUnsupportedBlock: false,
        allowUnsupportedInline: false,
        isMark: true,
      }),
    );
    expect(errorCallbackMock).toHaveBeenNthCalledWith(
      3,
      expect.anything(),
      expect.objectContaining({
        code: 'INVALID_CONTENT',
        message: 'fontSize: unsupported mark.',
        meta: unknownFontSize,
      }),
      expect.objectContaining({
        allowUnsupportedBlock: false,
        allowUnsupportedInline: false,
        isMark: true,
      }),
    );
    expect(errorCallbackMock).toHaveBeenNthCalledWith(
      4,
      expect.anything(),
      expect.objectContaining({
        code: 'INVALID_CONTENT',
        message: 'background: unsupported mark.',
        meta: unknownBackground,
      }),
      expect.objectContaining({
        allowUnsupportedBlock: false,
        allowUnsupportedInline: false,
        isMark: true,
      }),
    );
    expect(errorCallbackMock).toHaveBeenNthCalledWith(
      5,
      expect.anything(),
      expect.objectContaining({
        code: 'INVALID_CONTENT',
        message: 'fontSize: unsupported mark.',
        meta: unknownFontSize,
      }),
      expect.objectContaining({
        allowUnsupportedBlock: false,
        allowUnsupportedInline: false,
        isMark: true,
      }),
    );
  });

  it(`should not throw any error when multiple known and valid marks are applied on
      node with multiple specs`, () => {
    const initialEntity = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Some Text',
              marks: [
                {
                  type: 'strong',
                },
                {
                  type: 'em',
                },
                {
                  type: 'underline',
                },
              ],
            },
          ],
        },
      ],
    };
    validate(initialEntity, errorCallbackMock);
    expect(errorCallbackMock).not.toHaveBeenCalled();
  });

  it(`should throw INVALID_TYPE error when multiple known and not valid marks are applied on
      node with multiple specs`, () => {
    const mark1 = {
      type: 'strong',
    };
    const mark2 = {
      type: 'em',
    };
    const initialEntity = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Some Text',
            },
          ],
          marks: [mark1, mark2],
        },
      ],
    };
    validate(initialEntity, errorCallbackMock);
    expect(errorCallbackMock).toHaveBeenCalledTimes(6);
    expect(errorCallbackMock).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      expect.objectContaining({
        code: 'INVALID_TYPE',
        message: 'strong: unsupported mark.',
        meta: mark1,
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
        code: 'INVALID_TYPE',
        message: 'em: unsupported mark.',
        meta: mark2,
      }),
      expect.objectContaining({
        allowUnsupportedBlock: false,
        allowUnsupportedInline: false,
        isMark: true,
      }),
    );
    expect(errorCallbackMock).toHaveBeenNthCalledWith(
      3,
      expect.anything(),
      expect.objectContaining({
        code: 'INVALID_TYPE',
        message: 'strong: unsupported mark.',
        meta: mark1,
      }),
      expect.objectContaining({
        allowUnsupportedBlock: false,
        allowUnsupportedInline: false,
        isMark: true,
      }),
    );
    expect(errorCallbackMock).toHaveBeenNthCalledWith(
      4,
      expect.anything(),
      expect.objectContaining({
        code: 'INVALID_TYPE',
        message: 'em: unsupported mark.',
        meta: mark2,
      }),
      expect.objectContaining({
        allowUnsupportedBlock: false,
        allowUnsupportedInline: false,
        isMark: true,
      }),
    );
    expect(errorCallbackMock).toHaveBeenNthCalledWith(
      5,
      expect.anything(),
      expect.objectContaining({
        code: 'INVALID_TYPE',
        message: 'strong: unsupported mark.',
        meta: mark1,
      }),
      expect.objectContaining({
        allowUnsupportedBlock: false,
        allowUnsupportedInline: false,
        isMark: true,
      }),
    );
    expect(errorCallbackMock).toHaveBeenNthCalledWith(
      6,
      expect.anything(),
      expect.objectContaining({
        code: 'INVALID_TYPE',
        message: 'em: unsupported mark.',
        meta: mark2,
      }),
      expect.objectContaining({
        allowUnsupportedBlock: false,
        allowUnsupportedInline: false,
        isMark: true,
      }),
    );
  });

  it(`should throw INVALID_TYPE error, when known mark along with an unknown
      mark which are both invalid is applied to a node with multple specs.`, () => {
    const initialEntity = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Some Text',
            },
          ],
          marks: [
            {
              type: 'strong',
            },
            {
              type: 'unknownMark',
            },
          ],
        },
      ],
    };

    validate(initialEntity, errorCallbackMock);
    expect(errorCallbackMock).toHaveBeenCalledTimes(6);
    const expectedMeta1 = { type: 'strong' };
    const expectedMeta2 = { type: 'unknownMark' };
    expect(errorCallbackMock).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      expect.objectContaining({
        code: 'INVALID_TYPE',
        message: 'strong: unsupported mark.',
        meta: expectedMeta1,
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
        message: 'unknownMark: unsupported mark.',
        meta: expectedMeta2,
      }),
      expect.objectContaining({
        allowUnsupportedBlock: false,
        allowUnsupportedInline: false,
        isMark: true,
      }),
    );
  });

  it(`should throw REDUNDANT_MARKS error, when a known mark along with an unknown
      mark which are both invalid is applied to a node which supports tuple.`, () => {
    const unsupportedMark = {
      type: 'unsupportedMark',
      attrs: {
        align: 'center',
      },
    };

    const initialEntity = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'orderedList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'test ',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                    },
                  ],
                },
              ],
              marks: [
                {
                  type: 'strong',
                },
                unsupportedMark,
              ],
            },
          ],
        },
      ],
    };

    validate(initialEntity, errorCallbackMock);
    expect(errorCallbackMock).toHaveBeenCalledTimes(2);
    expect(errorCallbackMock).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      expect.objectContaining({
        code: 'REDUNDANT_MARKS',
        message: 'strong: unsupported mark.',
      }),
      {
        allowUnsupportedBlock: false,
        allowUnsupportedInline: false,
        isMark: true,
      },
    );
    expect(errorCallbackMock).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      expect.objectContaining({
        code: 'REDUNDANT_MARKS',
        message: 'unsupportedMark: unsupported mark.',
      }),
      {
        allowUnsupportedBlock: false,
        allowUnsupportedInline: false,
        isMark: true,
      },
    );
  });

  it(`should throw REDUNDANT_MARKS error, when a known mark applied
    which invalid to a node which supports tuple.`, () => {
    const strongMark = {
      type: 'strong',
    };

    const markWithAttr = { attr: { bg: 'color' }, type: 'alignment' };
    const initialEntity = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'taskList',
          content: [
            {
              type: 'taskItem',
              attrs: {
                localId: 'd5767f6e-30e2-4200-8aa4-71dde534b09d',
                state: 'TODO',
              },
              content: [
                {
                  type: 'text',
                  text: 'task list in task list',
                },
              ],
            },
            {
              type: 'taskList',
              attrs: {
                localId: '50886dde-39b3-4918-879e-a2fe7b8fed92',
              },
              content: [
                {
                  type: 'taskItem',
                  attrs: {
                    localId: '7dbecfab-6697-4901-851a-6083cb44f031',
                    state: 'TODO',
                  },
                  content: [
                    {
                      type: 'text',
                      text: 'child',
                    },
                  ],
                  marks: [strongMark, markWithAttr],
                },
              ],
            },
          ],
          attrs: {
            localId: '50886dde-39b3-4918-879e-a2fe7b8fed92',
          },
        },
      ],
    };

    validate(initialEntity, errorCallbackMock);
    expect(errorCallbackMock).toHaveBeenCalledTimes(2);
    expect(errorCallbackMock).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      expect.objectContaining({
        code: 'REDUNDANT_MARKS',
        message: 'strong: unsupported mark.',
        meta: strongMark,
      }),
      {
        allowUnsupportedBlock: false,
        allowUnsupportedInline: false,
        isMark: true,
      },
    );
    expect(errorCallbackMock).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      expect.objectContaining({
        code: 'REDUNDANT_MARKS',
        message: 'alignment: unsupported mark.',
        meta: markWithAttr,
      }),
      {
        allowUnsupportedBlock: false,
        allowUnsupportedInline: false,
        isMark: true,
      },
    );
  });

  it(`should return the valid spec when there are multiple specs for a node`, () => {
    /**
     * Paragraph and code have multiple specs validator should return appropriate spec.
     */
    errorCallbackMock.mockReturnValue({
      type: 'unsupportedMark',
      attrs: { originalValue: {} },
    });
    const content = {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'some ',
          marks: [
            {
              type: 'code',
            },
          ],
        },
        {
          type: 'text',
          text: 'inline',
          marks: [
            {
              type: 'code',
            },
            {
              type: 'annotation',
              attrs: {
                id: '80f91695-4e24-433d-93e1-6458b8bb12476',
                annotationType: 'inlineComment',
              },
            },
          ],
        },
        {
          type: 'text',
          text: ' code',
          marks: [
            {
              type: 'code',
            },
          ],
        },
      ],
    };
    const initialEntity = {
      version: 1,
      type: 'doc',
      content: [content],
    };
    const expectedEntity = {
      version: 1,
      type: 'doc',
      content: [content],
    };

    const { entity: resultantEntity } = validate(
      initialEntity,
      errorCallbackMock,
    );
    expect(resultantEntity).toBeDefined();
    expect(resultantEntity).toEqual(expectedEntity);
  });
});
