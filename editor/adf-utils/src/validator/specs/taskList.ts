export default {
  props: {
    type: { type: 'enum', values: ['taskList'] },
    content: {
      type: 'array',
      items: ['taskItem', ['taskItem', 'taskList']],
      isTupleLike: true,
      minItems: 1,
      allowUnsupportedBlock: true,
    },
    attrs: { props: { localId: { type: 'string' } } },
  },
};
