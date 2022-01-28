export default [
  'extension',
  {
    props: {
      marks: {
        type: 'array',
        items: [['dataConsumer', 'fragment']],
        optional: true,
      },
    },
  },
];
