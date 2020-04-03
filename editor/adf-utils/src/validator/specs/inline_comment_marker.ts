export default {
  props: {
    type: { type: 'enum', values: ['confluenceInlineComment'] },
    attrs: { props: { reference: { type: 'string' } } },
  },
};
