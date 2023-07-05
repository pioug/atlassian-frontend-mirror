export default {
  props: {
    type: { type: 'enum', values: ['mediaSingle'] },
    attrs: [
      {
        props: {
          widthType: { type: 'enum', values: ['percentage'], optional: true },
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
      {
        props: {
          width: { type: 'number', minimum: 0 },
          widthType: { type: 'enum', values: ['pixel'] },
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
    ],
    marks: { type: 'array', items: ['link'], optional: true },
  },
};
