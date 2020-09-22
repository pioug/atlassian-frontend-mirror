export default {
  props: {
    type: { type: 'enum', values: ['caption'] },
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
          'formatted_text_inline',
          'code_inline',
        ],
      ],
      minItems: 0,
    },
  },
};
