export default {
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
