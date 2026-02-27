export const alignment = {
  props: {
    type: { type: 'enum', values: ['alignment'] },
    attrs: { props: { align: { type: 'enum', values: ['center', 'end'] } } },
  },
};

export const annotation = {
  props: {
    type: { type: 'enum', values: ['annotation'] },
    attrs: {
      props: {
        id: { type: 'string' },
        annotationType: { type: 'enum', values: ['inlineComment'] },
      },
    },
  },
};

export const backgroundColor = {
  props: {
    type: { type: 'enum', values: ['backgroundColor'] },
    attrs: {
      props: { color: { pattern: '^#[0-9a-fA-F]{6}$', type: 'string' } },
    },
  },
};

export const block_content = [
  'blockCard',
  'paragraph_with_no_marks',
  'paragraph_with_alignment',
  'paragraph_with_indentation',
  'mediaSingle_caption',
  'mediaSingle_full',
  'codeBlock',
  'taskList',
  'bulletList',
  'orderedList',
  'heading_with_no_marks',
  'heading_with_alignment',
  'heading_with_indentation',
  'mediaGroup',
  'decisionList',
  'rule',
  'panel',
  'blockquote',
  'extension_with_marks',
  'embedCard',
  'table',
  'expand',
  'bodiedExtension_with_marks',
];

export const blockCard = {
  props: {
    type: { type: 'enum', values: ['blockCard'] },
    attrs: [
      {
        props: {
          localId: { type: 'string', optional: true },
          url: { type: 'string', optional: true, validatorFn: 'safeUrl' },
          datasource: {
            props: {
              id: { type: 'string' },
              parameters: { type: 'object' },
              views: {
                items: [
                  {
                    props: {
                      properties: { optional: true, type: 'object' },
                      type: { type: 'string' },
                    },
                  },
                ],
                minItems: 1,
                type: 'array',
              },
            },
          },
          width: { type: 'number', optional: true },
          layout: {
            type: 'enum',
            values: [
              'wide',
              'full-width',
              'center',
              'wrap-right',
              'wrap-left',
              'align-end',
              'align-start',
            ],
            optional: true,
          },
        },
      },
      {
        props: {
          url: { type: 'string', validatorFn: 'safeUrl' },
          localId: { type: 'string', optional: true },
        },
      },
      {
        props: {
          data: { type: 'object' },
          localId: { type: 'string', optional: true },
        },
      },
    ],
  },
  required: ['attrs'],
};

export const blockquote = {
  props: {
    type: { type: 'enum', values: ['blockquote'] },
    attrs: {
      props: { localId: { type: 'string', optional: true } },
      optional: true,
    },
    content: {
      type: 'array',
      items: [
        [
          'paragraph_with_no_marks',
          'orderedList',
          'bulletList',
          'codeBlock',
          'mediaSingle_caption',
          'mediaSingle_full',
          'mediaGroup',
          'extension_with_marks',
        ],
      ],
      minItems: 1,
      allowUnsupportedBlock: true,
    },
  },
};

export const blockRootOnly = ['multiBodiedExtension'];

export const blockTaskItem = {
  props: {
    type: { type: 'enum', values: ['blockTaskItem'] },
    attrs: {
      props: {
        localId: { type: 'string' },
        state: { type: 'enum', values: ['TODO', 'DONE'] },
      },
    },
    content: {
      type: 'array',
      isTupleLike: true,
      items: [
        ['paragraph_with_no_marks', 'extension_with_marks'],
        ['paragraph_with_no_marks', 'extension_with_marks'],
      ],
      minItems: 1,
    },
  },
};

export const bodiedExtension = {
  props: {
    type: { type: 'enum', values: ['bodiedExtension'] },
    attrs: {
      props: {
        extensionKey: { minLength: 1, type: 'string' },
        extensionType: { minLength: 1, type: 'string' },
        parameters: { type: 'object', optional: true },
        text: { type: 'string', optional: true },
        layout: {
          type: 'enum',
          values: ['wide', 'full-width', 'default'],
          optional: true,
        },
        localId: { minLength: 1, type: 'string', optional: true },
      },
    },
    content: {
      type: 'array',
      items: ['non_nestable_block_content'],
      minItems: 1,
      allowUnsupportedBlock: true,
    },
    marks: { type: 'array', items: [], optional: true },
  },
};

export const bodiedExtension_with_marks = [
  'bodiedExtension',
  {
    props: {
      marks: {
        type: 'array',
        optional: true,
        items: [['dataConsumer', 'fragment']],
      },
    },
  },
];

export const bodiedSyncBlock = {
  props: {
    type: { type: 'enum', values: ['bodiedSyncBlock'] },
    attrs: {
      props: { resourceId: { type: 'string' }, localId: { type: 'string' } },
    },
    content: {
      type: 'array',
      items: [
        [
          'paragraph',
          'paragraph_with_alignment',
          'paragraph_with_indentation',
          'paragraph_with_no_marks',
          'blockCard',
          'blockquote',
          'bulletList',
          'codeBlock',
          'decisionList',
          'embedCard',
          'expand',
          'heading',
          'heading_with_alignment',
          'heading_with_indentation',
          'heading_with_no_marks',
          'layoutSection',
          'layoutSection_with_single_column',
          'layoutSection_full',
          'mediaGroup',
          'mediaSingle',
          'mediaSingle_caption',
          'mediaSingle_full',
          'mediaSingle_width_type',
          'orderedList',
          'panel',
          'rule',
          'table',
          'taskList',
        ],
      ],
      minItems: 1,
      allowUnsupportedBlock: true,
    },
    marks: { type: 'array', optional: true, items: ['breakout'] },
  },
};

export const border = {
  props: {
    type: { type: 'enum', values: ['border'] },
    attrs: {
      props: {
        size: { type: 'number', minimum: 1, maximum: 3 },
        color: {
          pattern: '^#[0-9a-fA-F]{8}$|^#[0-9a-fA-F]{6}$',
          type: 'string',
        },
      },
    },
  },
};

export const breakout = {
  props: {
    type: { type: 'enum', values: ['breakout'] },
    attrs: {
      props: {
        mode: { type: 'enum', values: ['wide', 'full-width'] },
        width: { type: 'number', optional: true },
      },
    },
  },
};

export const bulletList = {
  props: {
    type: { type: 'enum', values: ['bulletList'] },
    attrs: {
      props: { localId: { type: 'string', optional: true } },
      optional: true,
    },
    content: {
      type: 'array',
      items: [['listItem', 'listItem_with_flexible_first_child']],
      minItems: 1,
    },
  },
};

export const caption = {
  props: {
    type: { type: 'enum', values: ['caption'] },
    attrs: {
      props: { localId: { type: 'string', optional: true } },
      optional: true,
    },
    content: {
      type: 'array',
      items: [
        [
          'hardBreak',
          'mention',
          'emoji',
          'date',
          'placeholder',
          'inlineCard',
          'status',
          'text_formatted',
          'text_code_inline',
        ],
      ],
      optional: true,
      allowUnsupportedInline: true,
    },
  },
};

export const code = { props: { type: { type: 'enum', values: ['code'] } } };

export const codeBlock = {
  props: {
    type: { type: 'enum', values: ['codeBlock'] },
    attrs: {
      props: {
        language: { type: 'string', optional: true },
        uniqueId: { type: 'string', optional: true },
        localId: { type: 'string', optional: true },
      },
      optional: true,
    },
    content: {
      type: 'array',
      items: ['text_with_no_marks'],
      optional: true,
      allowUnsupportedInline: true,
    },
  },
};

export const codeBlock_root_only = [
  'codeBlock',
  { props: { marks: { type: 'array', optional: true, items: ['breakout'] } } },
];

export const confluenceInlineComment = {
  props: {
    type: { type: 'enum', values: ['confluenceInlineComment'] },
    attrs: { props: { reference: { type: 'string' } } },
  },
};

export const dataConsumer = {
  props: {
    type: { type: 'enum', values: ['dataConsumer'] },
    attrs: {
      props: {
        sources: { type: 'array', items: [{ type: 'string' }], minItems: 1 },
      },
    },
  },
};

export const date = {
  props: {
    type: { type: 'enum', values: ['date'] },
    attrs: {
      props: {
        timestamp: { minLength: 1, type: 'string' },
        localId: { type: 'string', optional: true },
      },
    },
    marks: { type: 'array', optional: true, items: ['annotation'] },
  },
};

export const decisionItem = {
  props: {
    type: { type: 'enum', values: ['decisionItem'] },
    attrs: {
      props: { localId: { type: 'string' }, state: { type: 'string' } },
    },
    content: {
      type: 'array',
      items: ['inline_content'],
      optional: true,
      allowUnsupportedInline: true,
    },
  },
};

export const decisionList = {
  props: {
    type: { type: 'enum', values: ['decisionList'] },
    attrs: { props: { localId: { type: 'string' } } },
    content: {
      type: 'array',
      items: ['decisionItem'],
      minItems: 1,
      allowUnsupportedBlock: true,
    },
  },
};

export const doc = {
  props: {
    type: { type: 'enum', values: ['doc'] },
    version: { type: 'enum', values: [1] },
    content: {
      type: 'array',
      items: [
        [
          'blockCard',
          'paragraph_with_no_marks',
          'paragraph_with_alignment',
          'paragraph_with_indentation',
          'mediaSingle_caption',
          'mediaSingle_full',
          'codeBlock',
          'taskList',
          'bulletList',
          'orderedList',
          'heading_with_no_marks',
          'heading_with_alignment',
          'heading_with_indentation',
          'mediaGroup',
          'decisionList',
          'rule',
          'panel',
          'blockquote',
          'extension_with_marks',
          'embedCard',
          'table',
          'expand',
          'bodiedExtension_with_marks',
          'codeBlock_root_only',
          'layoutSection_with_single_column',
          'layoutSection_full',
          'multiBodiedExtension',
          'expand_root_only',
          'syncBlock',
          'bodiedSyncBlock',
        ],
      ],
      allowUnsupportedBlock: true,
    },
  },
};

export const em = { props: { type: { type: 'enum', values: ['em'] } } };

export const embedCard = {
  props: {
    type: { type: 'enum', values: ['embedCard'] },
    attrs: {
      props: {
        url: { type: 'string', validatorFn: 'safeUrl' },
        layout: {
          type: 'enum',
          values: [
            'wide',
            'full-width',
            'center',
            'wrap-right',
            'wrap-left',
            'align-end',
            'align-start',
          ],
        },
        width: { type: 'number', maximum: 100, minimum: 0, optional: true },
        originalHeight: { type: 'number', optional: true },
        originalWidth: { type: 'number', optional: true },
        localId: { type: 'string', optional: true },
      },
    },
  },
};

export const emoji = {
  props: {
    type: { type: 'enum', values: ['emoji'] },
    attrs: {
      props: {
        shortName: { type: 'string' },
        id: { type: 'string', optional: true },
        text: { type: 'string', optional: true },
        localId: { type: 'string', optional: true },
      },
    },
    marks: { type: 'array', optional: true, items: ['annotation'] },
  },
};

export const expand = {
  props: {
    type: { type: 'enum', values: ['expand'] },
    attrs: {
      props: {
        title: { type: 'string', optional: true },
        localId: { type: 'string', optional: true },
      },
      optional: true,
    },
    content: {
      type: 'array',
      items: [
        [
          'paragraph_with_no_marks',
          'panel',
          'blockquote',
          'orderedList',
          'bulletList',
          'rule',
          'heading_with_no_marks',
          'codeBlock',
          'mediaGroup',
          'mediaSingle_caption',
          'mediaSingle_full',
          'decisionList',
          'taskList',
          'table',
          'blockCard',
          'embedCard',
          'extension_with_marks',
          'nestedExpand_with_no_marks',
        ],
      ],
      minItems: 1,
      allowUnsupportedBlock: true,
    },
  },
};

export const expand_root_only = [
  'expand',
  { props: { marks: { type: 'array', optional: true, items: ['breakout'] } } },
];

export const extension = {
  props: {
    type: { type: 'enum', values: ['extension'] },
    attrs: {
      props: {
        extensionKey: { minLength: 1, type: 'string' },
        extensionType: { minLength: 1, type: 'string' },
        parameters: { type: 'object', optional: true },
        text: { type: 'string', optional: true },
        layout: {
          type: 'enum',
          values: ['wide', 'full-width', 'default'],
          optional: true,
        },
        localId: { minLength: 1, type: 'string', optional: true },
      },
    },
    marks: { type: 'array', items: [], optional: true },
  },
};

export const extension_with_marks = [
  'extension',
  {
    props: {
      marks: {
        type: 'array',
        optional: true,
        items: [['dataConsumer', 'fragment']],
      },
    },
  },
];

export const extensionFrame = {
  props: {
    type: { type: 'enum', values: ['extensionFrame'] },
    content: {
      type: 'array',
      items: [
        [
          'paragraph_with_no_marks',
          'panel',
          'blockquote',
          'orderedList',
          'bulletList',
          'rule',
          'heading_with_no_marks',
          'codeBlock',
          'mediaGroup',
          'mediaSingle_full',
          'mediaSingle_caption',
          'decisionList',
          'taskList',
          'table',
          'extension_with_marks',
          'bodiedExtension_with_marks',
          'blockCard',
          'embedCard',
        ],
      ],
      minItems: 1,
    },
    marks: {
      type: 'array',
      optional: true,
      items: [['dataConsumer', 'fragment']],
    },
  },
};

export const fragment = {
  props: {
    type: { type: 'enum', values: ['fragment'] },
    attrs: {
      props: {
        localId: { minLength: 1, type: 'string' },
        name: { type: 'string', optional: true },
      },
    },
  },
};

export const hardBreak = {
  props: {
    type: { type: 'enum', values: ['hardBreak'] },
    attrs: {
      props: {
        text: { type: 'enum', values: ['\n'], optional: true },
        localId: { type: 'string', optional: true },
      },
      optional: true,
    },
  },
};

export const heading = {
  props: {
    type: { type: 'enum', values: ['heading'] },
    attrs: {
      props: {
        level: { type: 'number', minimum: 1, maximum: 6 },
        localId: { type: 'string', optional: true },
      },
    },
    content: {
      type: 'array',
      items: ['inline_content'],
      optional: true,
      allowUnsupportedInline: true,
    },
    marks: { type: 'array', items: [], optional: true },
  },
};

export const heading_with_alignment = [
  'heading',
  { props: { marks: { type: 'array', optional: true, items: ['alignment'] } } },
];

export const heading_with_indentation = [
  'heading',
  {
    props: { marks: { type: 'array', optional: true, items: ['indentation'] } },
  },
];

export const heading_with_no_marks = [
  'heading',
  {
    props: { marks: { type: 'array', maxItems: 0, items: [], optional: true } },
  },
];

export const indentation = {
  props: {
    type: { type: 'enum', values: ['indentation'] },
    attrs: { props: { level: { type: 'number', minimum: 1, maximum: 6 } } },
  },
};

export const inline_content = [
  'text_formatted',
  'text_code_inline',
  'date',
  'emoji',
  'hardBreak',
  'inlineCard',
  'mention',
  'placeholder',
  'status',
  'inlineExtension_with_marks',
  'mediaInline',
];

export const inlineCard = {
  props: {
    type: { type: 'enum', values: ['inlineCard'] },
    attrs: [
      {
        props: {
          url: { type: 'string', validatorFn: 'safeUrl' },
          localId: { type: 'string', optional: true },
        },
      },
      {
        props: {
          data: { type: 'object' },
          localId: { type: 'string', optional: true },
        },
      },
    ],
    marks: { type: 'array', optional: true, items: ['annotation'] },
  },
  required: ['attrs'],
};

export const inlineExtension = {
  props: {
    type: { type: 'enum', values: ['inlineExtension'] },
    attrs: {
      props: {
        extensionKey: { minLength: 1, type: 'string' },
        extensionType: { minLength: 1, type: 'string' },
        parameters: { type: 'object', optional: true },
        text: { type: 'string', optional: true },
        localId: { minLength: 1, type: 'string', optional: true },
      },
    },
    marks: { type: 'array', items: [], optional: true },
  },
};

export const inlineExtension_with_marks = [
  'inlineExtension',
  {
    props: {
      marks: {
        type: 'array',
        optional: true,
        items: [['dataConsumer', 'fragment']],
      },
    },
  },
];

export const layoutColumn = {
  props: {
    type: { type: 'enum', values: ['layoutColumn'] },
    attrs: {
      props: {
        width: { type: 'number', minimum: 0, maximum: 100 },
        localId: { type: 'string', optional: true },
      },
    },
    content: {
      type: 'array',
      items: ['block_content'],
      minItems: 1,
      allowUnsupportedBlock: true,
    },
  },
};

export const layoutSection = {
  props: {
    type: { type: 'enum', values: ['layoutSection'] },
    attrs: {
      props: { localId: { type: 'string', optional: true } },
      optional: true,
    },
    content: {
      type: 'array',
      items: ['layoutColumn'],
      minItems: 1,
      maxItems: 3,
      allowUnsupportedBlock: true,
    },
    marks: { type: 'array', optional: true, items: ['breakout'] },
  },
};

export const layoutSection_full = [
  'layoutSection',
  {
    props: {
      content: {
        type: 'array',
        items: ['layoutColumn'],
        minItems: 2,
        maxItems: 3,
        allowUnsupportedBlock: true,
      },
      marks: { type: 'array', optional: true, items: ['breakout'] },
    },
  },
];

export const layoutSection_with_single_column = [
  'layoutSection',
  {
    props: {
      attrs: {
        props: {
          columnRuleStyle: { type: 'enum', values: ['solid'], optional: true },
          localId: { type: 'string', optional: true },
        },
        optional: true,
      },
      content: {
        type: 'array',
        items: ['layoutColumn'],
        minItems: 1,
        maxItems: 5,
        allowUnsupportedBlock: true,
      },
      marks: { type: 'array', optional: true, items: ['breakout'] },
    },
  },
];

export const link = {
  props: {
    type: { type: 'enum', values: ['link'] },
    attrs: {
      props: {
        href: { type: 'string', validatorFn: 'safeUrl' },
        title: { type: 'string', optional: true },
        id: { type: 'string', optional: true },
        collection: { type: 'string', optional: true },
        occurrenceKey: { type: 'string', optional: true },
      },
    },
  },
};

export const listItem = {
  props: {
    type: { type: 'enum', values: ['listItem'] },
    attrs: {
      props: { localId: { type: 'string', optional: true } },
      optional: true,
    },
    content: {
      type: 'array',
      isTupleLike: true,
      items: [
        [
          'paragraph_with_no_marks',
          'mediaSingle_caption',
          'mediaSingle_full',
          'codeBlock',
          'extension_with_marks',
        ],
        [
          'paragraph_with_no_marks',
          'bulletList',
          'orderedList',
          'taskList',
          'mediaSingle_caption',
          'mediaSingle_full',
          'codeBlock',
          'extension_with_marks',
        ],
      ],
      minItems: 1,
      allowUnsupportedBlock: true,
    },
  },
};

export const listItem_with_flexible_first_child = [
  'listItem',
  {
    props: {
      content: {
        type: 'array',
        items: [
          [
            'paragraph_with_no_marks',
            'bulletList',
            'orderedList',
            'taskList',
            'mediaSingle_caption',
            'mediaSingle_full',
            'codeBlock',
            'extension_with_marks',
          ],
        ],
        minItems: 1,
        allowUnsupportedBlock: true,
      },
    },
  },
];

export const media = {
  props: {
    type: { type: 'enum', values: ['media'] },
    attrs: [
      {
        props: {
          type: { type: 'enum', values: ['link', 'file'] },
          localId: { type: 'string', optional: true },
          id: { minLength: 1, type: 'string' },
          alt: { type: 'string', optional: true },
          collection: { type: 'string' },
          height: { type: 'number', optional: true },
          occurrenceKey: { minLength: 1, type: 'string', optional: true },
          width: { type: 'number', optional: true },
        },
      },
      {
        props: {
          type: { type: 'enum', values: ['external'] },
          localId: { type: 'string', optional: true },
          alt: { type: 'string', optional: true },
          height: { type: 'number', optional: true },
          width: { type: 'number', optional: true },
          url: { type: 'string' },
        },
      },
    ],
    marks: {
      type: 'array',
      optional: true,
      items: [['link', 'annotation', 'border']],
    },
  },
  required: ['attrs'],
};

export const mediaGroup = {
  props: {
    type: { type: 'enum', values: ['mediaGroup'] },
    content: {
      type: 'array',
      items: ['media'],
      minItems: 1,
      allowUnsupportedBlock: true,
    },
  },
};

export const mediaInline = {
  props: {
    type: { type: 'enum', values: ['mediaInline'] },
    attrs: {
      props: {
        type: {
          type: 'enum',
          values: ['link', 'file', 'image'],
          optional: true,
        },
        localId: { type: 'string', optional: true },
        url: { type: 'string', optional: true },
        id: { minLength: 1, type: 'string' },
        alt: { type: 'string', optional: true },
        collection: { type: 'string' },
        occurrenceKey: { minLength: 1, type: 'string', optional: true },
        width: { type: 'number', optional: true },
        height: { type: 'number', optional: true },
        data: { type: 'object', optional: true },
      },
    },
    marks: {
      type: 'array',
      optional: true,
      items: [['link', 'annotation', 'border']],
    },
  },
};

export const mediaSingle = {
  props: {
    type: { type: 'enum', values: ['mediaSingle'] },
    attrs: [
      {
        props: {
          localId: { type: 'string', optional: true },
          width: { type: 'number', minimum: 0, maximum: 100, optional: true },
          layout: {
            type: 'enum',
            values: [
              'wide',
              'full-width',
              'center',
              'wrap-right',
              'wrap-left',
              'align-end',
              'align-start',
            ],
          },
          widthType: { type: 'enum', values: ['percentage'], optional: true },
        },
      },
      {
        props: {
          localId: { type: 'string', optional: true },
          width: { type: 'number', minimum: 0 },
          widthType: { type: 'enum', values: ['pixel'] },
          layout: {
            type: 'enum',
            values: [
              'wide',
              'full-width',
              'center',
              'wrap-right',
              'wrap-left',
              'align-end',
              'align-start',
            ],
          },
        },
      },
    ],
    marks: { type: 'array', optional: true, items: ['link'] },
  },
};

export const mediaSingle_caption = [
  'mediaSingle',
  {
    props: {
      content: {
        type: 'array',
        isTupleLike: true,
        items: ['media', 'caption'],
        minItems: 1,
        maxItems: 2,
        allowUnsupportedBlock: true,
      },
    },
  },
];

export const mediaSingle_full = [
  'mediaSingle',
  {
    props: {
      content: {
        type: 'array',
        items: ['media'],
        minItems: 1,
        maxItems: 1,
        allowUnsupportedBlock: true,
      },
    },
  },
];

export const mediaSingle_width_type = [
  'mediaSingle',
  {
    props: {
      content: {
        type: 'array',
        items: ['media'],
        minItems: 1,
        maxItems: 1,
        allowUnsupportedBlock: true,
      },
    },
  },
];

export const mention = {
  props: {
    type: { type: 'enum', values: ['mention'] },
    attrs: {
      props: {
        id: { type: 'string' },
        localId: { type: 'string', optional: true },
        text: { type: 'string', optional: true },
        accessLevel: { type: 'string', optional: true },
        userType: {
          type: 'enum',
          values: ['DEFAULT', 'SPECIAL', 'APP'],
          optional: true,
        },
      },
    },
    marks: { type: 'array', optional: true, items: ['annotation'] },
  },
};

export const multiBodiedExtension = {
  props: {
    type: { type: 'enum', values: ['multiBodiedExtension'] },
    attrs: {
      props: {
        extensionKey: { type: 'string', minLength: 1 },
        extensionType: { type: 'string', minLength: 1 },
        parameters: { type: 'object', optional: true },
        text: { type: 'string', optional: true },
        layout: {
          type: 'enum',
          values: ['default', 'wide', 'full-width'],
          optional: true,
        },
        localId: { type: 'string', optional: true, minLength: 1 },
      },
    },
    content: { type: 'array', items: ['extensionFrame'] },
    marks: { type: 'array', items: [], optional: true },
  },
};

export const nestedExpand = {
  props: {
    type: { type: 'enum', values: ['nestedExpand'] },
    attrs: {
      props: {
        title: { type: 'string', optional: true },
        localId: { type: 'string', optional: true },
      },
    },
    content: 'nestedExpand_content',
  },
  required: ['content'],
};

export const nestedExpand_content = {
  type: 'array',
  items: [
    [
      'paragraph_with_no_marks',
      'heading_with_no_marks',
      'mediaSingle_caption',
      'mediaSingle_full',
      'mediaGroup',
      'codeBlock',
      'bulletList',
      'orderedList',
      'taskList',
      'decisionList',
      'rule',
      'panel',
      'blockquote',
      'extension_with_marks',
    ],
  ],
  minItems: 1,
  allowUnsupportedBlock: true,
};

export const nestedExpand_with_no_marks = [
  'nestedExpand',
  {
    props: { marks: { type: 'array', maxItems: 0, items: [], optional: true } },
  },
];

export const non_nestable_block_content = [
  'paragraph_with_no_marks',
  'panel',
  'blockquote',
  'orderedList',
  'bulletList',
  'rule',
  'heading_with_no_marks',
  'codeBlock',
  'mediaGroup',
  'mediaSingle_caption',
  'mediaSingle_full',
  'decisionList',
  'taskList',
  'table',
  'blockCard',
  'embedCard',
  'extension_with_marks',
];

export const orderedList = {
  props: {
    type: { type: 'enum', values: ['orderedList'] },
    attrs: {
      props: {
        order: { type: 'number', minimum: 0, optional: true },
        localId: { type: 'string', optional: true },
      },
      optional: true,
    },
    content: {
      type: 'array',
      items: [['listItem', 'listItem_with_flexible_first_child']],
      minItems: 1,
    },
  },
};

export const panel = {
  props: {
    type: { type: 'enum', values: ['panel'] },
    attrs: {
      props: {
        panelType: {
          type: 'enum',
          values: [
            'info',
            'note',
            'tip',
            'warning',
            'error',
            'success',
            'custom',
          ],
        },
        panelIcon: { type: 'string', optional: true },
        panelIconId: { type: 'string', optional: true },
        panelIconText: { type: 'string', optional: true },
        panelColor: { type: 'string', optional: true },
        localId: { type: 'string', optional: true },
      },
    },
    content: {
      type: 'array',
      items: [
        [
          'paragraph_with_no_marks',
          'heading_with_no_marks',
          'bulletList',
          'orderedList',
          'blockCard',
          'mediaGroup',
          'mediaSingle_caption',
          'mediaSingle_full',
          'codeBlock',
          'taskList',
          'rule',
          'decisionList',
          'extension_with_marks',
        ],
      ],
      minItems: 1,
      allowUnsupportedBlock: true,
    },
  },
};

export const paragraph = {
  props: {
    type: { type: 'enum', values: ['paragraph'] },
    attrs: {
      props: { localId: { type: 'string', optional: true } },
      optional: true,
    },
    content: {
      type: 'array',
      items: ['inline_content'],
      optional: true,
      allowUnsupportedInline: true,
    },
    marks: { type: 'array', items: [], optional: true },
  },
};

export const paragraph_with_alignment = [
  'paragraph',
  { props: { marks: { type: 'array', optional: true, items: ['alignment'] } } },
];

export const paragraph_with_indentation = [
  'paragraph',
  {
    props: { marks: { type: 'array', optional: true, items: ['indentation'] } },
  },
];

export const paragraph_with_no_marks = [
  'paragraph',
  {
    props: { marks: { type: 'array', maxItems: 0, items: [], optional: true } },
  },
];

export const placeholder = {
  props: {
    type: { type: 'enum', values: ['placeholder'] },
    attrs: {
      props: {
        text: { type: 'string' },
        localId: { type: 'string', optional: true },
      },
    },
  },
};

export const rule = {
  props: {
    type: { type: 'enum', values: ['rule'] },
    attrs: {
      props: { localId: { type: 'string', optional: true } },
      optional: true,
    },
  },
};

export const status = {
  props: {
    type: { type: 'enum', values: ['status'] },
    attrs: {
      props: {
        text: { minLength: 1, type: 'string' },
        color: {
          type: 'enum',
          values: ['neutral', 'purple', 'blue', 'red', 'yellow', 'green'],
        },
        localId: { type: 'string', optional: true },
        style: { type: 'string', optional: true },
      },
    },
    marks: { type: 'array', optional: true, items: ['annotation'] },
  },
};

export const strike = { props: { type: { type: 'enum', values: ['strike'] } } };

export const strong = { props: { type: { type: 'enum', values: ['strong'] } } };

export const subsup = {
  props: {
    type: { type: 'enum', values: ['subsup'] },
    attrs: { props: { type: { type: 'enum', values: ['sub', 'sup'] } } },
  },
};

export const syncBlock = {
  props: {
    type: { type: 'enum', values: ['syncBlock'] },
    attrs: {
      props: { resourceId: { type: 'string' }, localId: { type: 'string' } },
    },
    marks: { type: 'array', optional: true, items: ['breakout'] },
  },
};

export const table = {
  props: {
    type: { type: 'enum', values: ['table'] },
    attrs: {
      props: {
        displayMode: {
          type: 'enum',
          values: ['default', 'fixed'],
          optional: true,
        },
        isNumberColumnEnabled: { type: 'boolean', optional: true },
        layout: {
          type: 'enum',
          values: [
            'wide',
            'full-width',
            'center',
            'align-end',
            'align-start',
            'default',
          ],
          optional: true,
        },
        localId: { type: 'string', minLength: 1, optional: true },
        width: { type: 'number', optional: true },
      },
      optional: true,
    },
    content: { type: 'array', items: ['tableRow'], minItems: 1 },
    marks: { type: 'array', optional: true, items: ['fragment'] },
  },
};

export const tableCell = {
  props: {
    type: { type: 'enum', values: ['tableCell'] },
    attrs: {
      props: {
        colspan: { type: 'number', optional: true },
        rowspan: { type: 'number', optional: true },
        colwidth: {
          type: 'array',
          items: [{ type: 'number' }],
          optional: true,
        },
        background: { type: 'string', optional: true },
        localId: { type: 'string', optional: true },
      },
      optional: true,
    },
    content: {
      type: 'array',
      items: [
        [
          'paragraph_with_no_marks',
          'paragraph_with_alignment',
          'panel',
          'blockquote',
          'orderedList',
          'bulletList',
          'rule',
          'heading_with_no_marks',
          'heading_with_alignment',
          'heading_with_indentation',
          'codeBlock',
          'mediaSingle_caption',
          'mediaSingle_full',
          'mediaGroup',
          'decisionList',
          'taskList',
          'blockCard',
          'embedCard',
          'extension_with_marks',
          'nestedExpand_with_no_marks',
        ],
      ],
      minItems: 1,
      allowUnsupportedBlock: true,
    },
  },
  required: ['content'],
};

export const tableHeader = {
  props: {
    type: { type: 'enum', values: ['tableHeader'] },
    attrs: {
      props: {
        colspan: { type: 'number', optional: true },
        rowspan: { type: 'number', optional: true },
        colwidth: {
          type: 'array',
          items: [{ type: 'number' }],
          optional: true,
        },
        background: { type: 'string', optional: true },
        localId: { type: 'string', optional: true },
      },
      optional: true,
    },
    content: {
      type: 'array',
      items: [
        [
          'paragraph_with_no_marks',
          'paragraph_with_alignment',
          'panel',
          'blockquote',
          'orderedList',
          'bulletList',
          'rule',
          'heading_with_no_marks',
          'heading_with_alignment',
          'heading_with_indentation',
          'codeBlock',
          'mediaSingle_caption',
          'mediaSingle_full',
          'mediaGroup',
          'decisionList',
          'taskList',
          'blockCard',
          'embedCard',
          'extension_with_marks',
          'nestedExpand_with_no_marks',
          'nestedExpand',
        ],
      ],
      minItems: 1,
    },
  },
  required: ['content'],
};

export const tableRow = {
  props: {
    type: { type: 'enum', values: ['tableRow'] },
    attrs: {
      props: { localId: { type: 'string', optional: true } },
      optional: true,
    },
    content: { type: 'array', items: [['tableCell', 'tableHeader']] },
  },
};

export const taskItem = {
  props: {
    type: { type: 'enum', values: ['taskItem'] },
    attrs: {
      props: {
        localId: { type: 'string' },
        state: { type: 'enum', values: ['TODO', 'DONE'] },
      },
    },
    content: {
      type: 'array',
      items: ['inline_content'],
      optional: true,
      allowUnsupportedInline: true,
    },
  },
};

export const taskList = {
  props: {
    type: { type: 'enum', values: ['taskList'] },
    attrs: { props: { localId: { type: 'string' } } },
    content: {
      type: 'array',
      isTupleLike: true,
      items: [
        ['taskItem', 'blockTaskItem'],
        ['taskItem', 'taskList', 'blockTaskItem'],
      ],
      minItems: 1,
      allowUnsupportedBlock: true,
    },
  },
};

export const text = {
  props: {
    type: { type: 'enum', values: ['text'] },
    text: { type: 'string', minLength: 1 },
    marks: { type: 'array', items: [], optional: true },
  },
};

export const text_code_inline = [
  'text',
  {
    props: {
      marks: {
        type: 'array',
        optional: true,
        items: [['code', 'link', 'annotation']],
      },
    },
  },
];

export const text_formatted = [
  'text',
  {
    props: {
      marks: {
        type: 'array',
        optional: true,
        items: [
          [
            'link',
            'em',
            'strong',
            'strike',
            'subsup',
            'underline',
            'textColor',
            'annotation',
            'backgroundColor',
            null,
          ],
        ],
      },
    },
  },
];

export const text_link_inline = [
  'text',
  { props: { marks: { type: 'array', optional: true, items: ['link'] } } },
];

export const text_with_no_marks = [
  'text',
  {
    props: { marks: { type: 'array', maxItems: 0, items: [], optional: true } },
  },
];

export const textColor = {
  props: {
    type: { type: 'enum', values: ['textColor'] },
    attrs: {
      props: { color: { type: 'string', pattern: '^#[0-9a-fA-F]{6}$' } },
    },
  },
};

export const underline = {
  props: { type: { type: 'enum', values: ['underline'] } },
};
