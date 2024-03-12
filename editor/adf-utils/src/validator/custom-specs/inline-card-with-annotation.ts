// This is a custom spec we're using for inline card till the inline comments feature is fully rolled out.
export const inlineCardWithAnnotation = {
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
