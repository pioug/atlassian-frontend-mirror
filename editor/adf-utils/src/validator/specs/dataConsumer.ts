export default {
  props: {
    type: { type: 'enum', values: ['dataConsumer'] },
    attrs: {
      props: {
        sources: { type: 'array', items: [{ type: 'string' }], minItems: 1 },
      },
    },
  },
};
