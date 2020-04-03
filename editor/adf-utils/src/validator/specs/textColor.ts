export default {
  props: {
    type: { type: 'enum', values: ['textColor'] },
    attrs: [
      { props: { color: { type: 'string', pattern: '^#[0-9a-f]{6}$' } } },
      { props: { color: { type: 'string', pattern: '^#[0-9a-fA-F]{6}$' } } },
    ],
  },
  required: ['attrs'],
};
