export default {
  props: {
    type: { type: 'enum', values: ['mediaSingle'] },
    attrs: {
      props: {
        width: { type: 'number', minimum: 0, maximum: 100, optional: true },
        layout: {
          type: 'enum',
          values: [
            'wide',
            'full-width',
            'center',
            'wrap-right',
            'wrap-left',
            'align-end',
            'align-start',
          ],
        },
      },
      optional: true,
    },
    marks: { type: 'array', items: ['link'], optional: true },
  },
};
