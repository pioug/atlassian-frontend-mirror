export default {
  props: {
    type: { type: 'enum', values: ['expand'] },
    attrs: { props: { title: { type: 'string', optional: true } } },
    content: {
      type: 'array',
      items: ['non_nestable_block_content'],
      minItems: 1,
      allowUnsupportedBlock: true,
    },
    marks: { type: 'array', items: [], optional: true },
  },
};
