export default {
  props: {
    type: { type: 'enum', values: ['taskItem'] },
    content: {
      type: 'array',
      items: ['inline'],
      allowUnsupportedInline: true,
      optional: true,
    },
    attrs: {
      props: {
        localId: { type: 'string' },
        state: { type: 'enum', values: ['TODO', 'DONE'] },
      },
    },
  },
};
