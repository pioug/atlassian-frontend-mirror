export default {
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
