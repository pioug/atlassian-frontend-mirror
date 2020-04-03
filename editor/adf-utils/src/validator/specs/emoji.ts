export default {
  props: {
    type: { type: 'enum', values: ['emoji'] },
    attrs: {
      props: {
        id: { type: 'string', optional: true },
        shortName: { type: 'string' },
        text: { type: 'string', optional: true },
      },
    },
  },
};
