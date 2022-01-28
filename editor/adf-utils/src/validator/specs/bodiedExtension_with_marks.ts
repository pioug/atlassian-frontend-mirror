export default [
  'bodiedExtension',
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
