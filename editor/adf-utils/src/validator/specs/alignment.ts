export default {
  props: {
    type: { type: 'enum', values: ['alignment'] },
    attrs: { props: { align: { type: 'enum', values: ['center', 'end'] } } },
  },
};
