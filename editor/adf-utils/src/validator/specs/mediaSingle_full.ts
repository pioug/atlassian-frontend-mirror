export default [
  'mediaSingle',
  {
    props: {
      content: {
        type: 'array',
        items: ['media'],
        isTupleLike: true,
        minItems: 1,
        maxItems: 1,
      },
    },
  },
];
