export default [
  'mediaSingle',
  {
    props: {
      content: {
        type: 'array',
        items: ['media'],
        minItems: 1,
        maxItems: 1,
        allowUnsupportedBlock: true,
      },
    },
  },
];
