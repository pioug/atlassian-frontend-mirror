export default {
  props: {
    type: { type: 'enum', values: ['text'] },
    text: { type: 'string', minLength: 1 },
    marks: { type: 'array', items: [], optional: true },
  },
};
