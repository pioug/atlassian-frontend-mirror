export default {
  props: {
    type: { type: 'enum', values: ['subsup'] },
    attrs: { props: { type: { type: 'enum', values: ['sub', 'sup'] } } },
  },
};
