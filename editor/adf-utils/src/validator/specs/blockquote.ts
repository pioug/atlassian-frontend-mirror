export default {
  props: {
    type: { type: 'enum', values: ['blockquote'] },
    content: {
      type: 'array',
      items: ['paragraph_with_no_marks'],
      minItems: 1,
      allowUnsupportedBlock: true,
    },
  },
};
