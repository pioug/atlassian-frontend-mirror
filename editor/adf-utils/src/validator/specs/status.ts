export default {
  props: {
    type: { type: 'enum', values: ['status'] },
    attrs: {
      props: {
        text: { type: 'string', minLength: 1 },
        color: {
          type: 'enum',
          values: ['neutral', 'purple', 'blue', 'red', 'yellow', 'green'],
        },
        localId: { type: 'string', optional: true },
        style: { type: 'string', optional: true },
      },
    },
  },
};
