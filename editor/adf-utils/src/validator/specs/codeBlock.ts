export default {
  props: {
    type: { type: 'enum', values: ['codeBlock'] },
    content: {
      type: 'array',
      items: [
        [
          'text',
          {
            props: {
              marks: { type: 'array', items: [], maxItems: 0, optional: true },
            },
          },
        ],
      ],
      optional: true,
    },
    marks: { type: 'array', items: [], optional: true },
    attrs: {
      props: { language: { type: 'string', optional: true } },
      optional: true,
    },
  },
};
