export default [
  'mediaSingle',
  {
    props: {
      content: {
        type: 'array',
        items: ['media', 'caption'],
        isTupleLike: true,
        minItems: 1,
        maxItems: 2,
        allowUnsupportedBlock: true,
      },
    },
  },
];
