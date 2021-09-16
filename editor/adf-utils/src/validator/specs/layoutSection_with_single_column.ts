export default [
  'layoutSection',
  {
    props: {
      type: { type: 'enum', values: ['layoutSection'] },
      marks: { type: 'array', items: ['breakout'], optional: true },
      content: {
        type: 'array',
        items: ['layoutColumn'],
        minItems: 1,
        maxItems: 3,
        allowUnsupportedBlock: true,
      },
    },
  },
];
