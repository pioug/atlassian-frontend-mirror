export default {
  props: {
    type: { type: 'enum', values: ['mediaInline'] },
    attrs: {
      props: {
        data: { type: 'object', optional: true },
        id: { type: 'string', minLength: 1 },
        collection: { type: 'string' },
        height: { type: 'number', optional: true },
        width: { type: 'number', optional: true },
        occurrenceKey: { type: 'string', minLength: 1, optional: true },
        alt: { type: 'string', optional: true },
      },
    },
    marks: { type: 'array', items: ['link'], optional: true },
  },
};
