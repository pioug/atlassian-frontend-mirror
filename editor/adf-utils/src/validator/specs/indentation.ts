export default {
  props: {
    type: { type: 'enum', values: ['indentation'] },
    attrs: { props: { level: { type: 'number', minimum: 1, maximum: 6 } } },
  },
};
