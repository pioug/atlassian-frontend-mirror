export default {
  props: {
    type: { type: 'enum', values: ['decisionItem'] },
    content: {
      type: 'array',
      items: ['inline'],
      allowUnsupportedInline: true,
      optional: true,
    },
    attrs: {
      props: { localId: { type: 'string' }, state: { type: 'string' } },
    },
  },
};
