export default {
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
      },
    },
    content: {
      type: 'array',
      items: [
        [
          'blockCard',
          'paragraph_with_no_marks',
          'mediaSingle_caption',
          'mediaSingle_full',
          'codeBlock_with_no_marks',
          'taskList',
          'bulletList',
          'orderedList',
          'heading_with_no_marks',
          'mediaGroup',
          'decisionList',
          'rule',
        ],
      ],
      minItems: 1,
      allowUnsupportedBlock: true,
    },
  },
};
