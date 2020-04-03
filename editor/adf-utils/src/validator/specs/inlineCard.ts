export default {
  props: {
    type: { type: 'enum', values: ['inlineCard'] },
    attrs: [
      { props: { url: { type: 'string' } } },
      { props: { data: { type: 'object' } } },
    ],
  },
  required: ['attrs'],
};
