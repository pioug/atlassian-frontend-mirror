export default {
  props: {
    type: { type: 'enum', values: ['backgroundColor'] },
    attrs: {
      props: { color: { type: 'string', pattern: '^#[0-9a-fA-F]{6}$' } },
    },
  },
};
