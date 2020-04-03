export default {
  props: {
    type: { type: 'enum', values: ['bulletList'] },
    content: { type: 'array', items: ['listItem'], minItems: 1 },
  },
};
