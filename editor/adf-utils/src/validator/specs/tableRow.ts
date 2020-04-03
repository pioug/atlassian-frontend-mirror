export default {
  props: {
    type: { type: 'enum', values: ['tableRow'] },
    content: { type: 'array', items: [['tableCell', 'tableHeader']] },
  },
};
