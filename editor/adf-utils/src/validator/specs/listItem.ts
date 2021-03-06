export default {
  props: {
    type: { type: 'enum', values: ['listItem'] },
    content: {
      type: 'array',
      items: [
        [
          'paragraph_with_no_marks',
          'mediaSingle_full',
          'mediaSingle_caption',
          'codeBlock_with_no_marks',
        ],
        [
          'paragraph_with_no_marks',
          'bulletList',
          'mediaSingle_full',
          'mediaSingle_caption',
          'codeBlock_with_no_marks',
          'orderedList',
        ],
      ],
      isTupleLike: true,
      minItems: 1,
    },
  },
};
