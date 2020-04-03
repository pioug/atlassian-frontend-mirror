export default {
  props: {
    type: { type: 'enum', values: ['nestedExpand'] },
    attrs: { props: { title: { type: 'string', optional: true } } },
    content: 'nestedExpand_content',
  },
  required: ['content'],
};
