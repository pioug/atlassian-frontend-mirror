export default {
  props: {
    type: { type: 'enum', values: ['blockCard'] },
    attrs: [
      { props: { url: { type: 'string' } } },
      { props: { data: { type: 'object' } } },
    ],
  },
  required: ['attrs'],
};
