export default {
  props: {
    type: { type: 'enum', values: ['table'] },
    attrs: {
      props: {
        isNumberColumnEnabled: { type: 'boolean', optional: true },
        layout: {
          type: 'enum',
          values: ['wide', 'full-width', 'default'],
          optional: true,
        },
      },
      optional: true,
    },
    content: { type: 'array', items: ['tableRow'], minItems: 1 },
  },
};
