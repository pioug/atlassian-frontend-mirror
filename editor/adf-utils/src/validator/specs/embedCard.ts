export default {
  props: {
    type: { type: 'enum', values: ['embedCard'] },
    attrs: {
      props: {
        originalWidth: { type: 'number', optional: true },
        originalHeight: { type: 'number', optional: true },
        url: { type: 'string' },
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
    },
  },
};
