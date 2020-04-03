export default [
  'text',
  {
    props: {
      marks: {
        type: 'array',
        items: [['code', 'link', 'annotation']],
        optional: true,
      },
    },
  },
];
