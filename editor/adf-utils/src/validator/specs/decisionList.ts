export default {
  props: {
    type: { type: 'enum', values: ['decisionList'] },
    content: {
      type: 'array',
      items: ['decisionItem'],
      minItems: 1,
      allowUnsupportedBlock: true,
    },
    attrs: { props: { localId: { type: 'string' } } },
  },
};
