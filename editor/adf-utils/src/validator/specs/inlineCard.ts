export default {
  props: {
    type: { type: 'enum', values: ['inlineCard'] },
    attrs: [
      { props: { url: { type: 'string', validatorFn: 'safeUrl' } } },
      { props: { data: { type: 'object' } } },
    ],
    marks: { type: 'array', items: ['annotation'], optional: true },
  },
  required: ['attrs'],
};
