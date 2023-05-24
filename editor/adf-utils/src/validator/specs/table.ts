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
        localId: { type: 'string', minLength: 1, optional: true },
        width: { type: 'number', optional: true },
      },
      optional: true,
    },
    content: { type: 'array', items: ['tableRow'], minItems: 1 },
    marks: { type: 'array', items: ['fragment'], optional: true },
  },
};
