export default {
  props: {
    type: { type: 'enum', values: ['hardBreak'] },
    attrs: {
      props: { text: { type: 'enum', values: ['\n'], optional: true } },
      optional: true,
    },
  },
};
