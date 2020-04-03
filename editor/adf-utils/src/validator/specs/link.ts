export default {
  props: {
    type: { type: 'enum', values: ['link'] },
    attrs: {
      props: {
        href: { type: 'string' },
        title: { type: 'string', optional: true },
        id: { type: 'string', optional: true },
        collection: { type: 'string', optional: true },
        occurrenceKey: { type: 'string', optional: true },
      },
    },
  },
};
