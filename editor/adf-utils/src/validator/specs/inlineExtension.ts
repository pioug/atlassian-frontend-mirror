export default {
  props: {
    type: { type: 'enum', values: ['inlineExtension'] },
    attrs: {
      props: {
        extensionKey: { type: 'string', minLength: 1 },
        extensionType: { type: 'string', minLength: 1 },
        parameters: { type: 'object', optional: true },
        text: { type: 'string', optional: true },
        localId: { type: 'string', minLength: 1, optional: true },
      },
    },
    marks: { type: 'array', items: [], optional: true },
  },
};
