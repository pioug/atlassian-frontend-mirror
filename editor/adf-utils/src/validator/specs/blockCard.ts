export default {
  props: {
    type: { type: 'enum', values: ['blockCard'] },
    attrs: [
      { props: { url: { type: 'string', validatorFn: 'safeUrl' } } },
      { props: { data: { type: 'object' } } },
    ],
  },
  required: ['attrs'],
};
