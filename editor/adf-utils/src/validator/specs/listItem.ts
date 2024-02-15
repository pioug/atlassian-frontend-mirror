export default {
  props: {
    type: { type: 'enum', values: ['listItem'] },
    content: {
      type: 'array',
      items: [
        [
          'paragraph_with_no_marks',
          'mediaSingle_caption',
          'mediaSingle_full',
          'codeBlock_with_no_marks',
        ],
        [
          'paragraph_with_no_marks',
          'mediaSingle_caption',
          'mediaSingle_full',
          'codeBlock_with_no_marks',
          'taskList',
          'bulletList',
          'orderedList',
        ],
      ],
      isTupleLike: true,
      minItems: 1,
      allowUnsupportedBlock: true,
    },
  },
};
