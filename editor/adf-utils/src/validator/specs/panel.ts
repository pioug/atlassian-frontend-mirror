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
        panelColor: { type: 'string', optional: true },
      },
    },
    content: {
      type: 'array',
      items: [
        [
          'blockCard',
          'paragraph_with_no_marks',
          'bulletList',
          'orderedList',
          'heading_with_no_marks',
        ],
      ],
      minItems: 1,
      allowUnsupportedBlock: true,
    },
  },
};
