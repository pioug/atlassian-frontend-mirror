export default {
  props: {
    type: { type: 'enum', values: ['paragraph'] },
    content: {
      type: 'array',
      items: ['inline'],
      allowUnsupportedInline: true,
      optional: true,
    },
    marks: { type: 'array', items: [], optional: true },
    attrs: {
      optional: true,
      props: { localId: { type: 'string', optional: true } },
    },
  },
};
