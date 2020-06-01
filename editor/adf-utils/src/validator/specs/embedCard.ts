export default {
  props: {
    type: { type: 'enum', values: ['embedCard'] },
    attrs: {
      props: {
        width: { type: 'number', minimum: 0, maximum: 100, optional: true },
        originalWidth: { type: 'number', optional: true },
        originalHeight: { type: 'number', optional: true },
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
        url: { type: 'string' },
      },
    },
  },
};
