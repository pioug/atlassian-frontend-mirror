export default {
  props: {
    type: { type: 'enum', values: ['mention'] },
    attrs: {
      props: {
        id: { type: 'string' },
        text: { type: 'string', optional: true },
        userType: {
          type: 'enum',
          values: ['DEFAULT', 'SPECIAL', 'APP'],
          optional: true,
        },
        accessLevel: { type: 'string', optional: true },
      },
    },
  },
};
