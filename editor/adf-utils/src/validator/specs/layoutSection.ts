export default {
  props: {
    type: { type: 'enum', values: ['layoutSection'] },
    marks: { type: 'array', items: ['breakout'], optional: true },
    content: { type: 'array', items: ['layoutColumn'] },
  },
};
