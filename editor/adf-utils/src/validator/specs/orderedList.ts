export default {
  props: {
    type: { type: 'enum', values: ['orderedList'] },
    content: { type: 'array', items: ['listItem'], minItems: 1 },
    attrs: { props: { order: { type: 'number', minimum: 1 } }, optional: true },
  },
};
