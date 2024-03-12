// PLEASE DO NOT ADD marks IN THIS FILE
export default {
  props: {
    type: { type: 'enum', values: ['inlineCard'] },
    attrs: [
      { props: { url: { type: 'string', validatorFn: 'safeUrl' } } },
      { props: { data: { type: 'object' } } },
    ],
  },
  required: ['attrs'],
};
