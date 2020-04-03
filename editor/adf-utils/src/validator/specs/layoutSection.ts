export default {
  props: {
    type: { type: 'enum', values: ['layoutSection'] },
    content: {
      type: 'array',
      items: ['layoutColumn'],
      minItems: 2,
      maxItems: 3,
    },
    marks: { type: 'array', items: ['breakout'], optional: true },
  },
};
