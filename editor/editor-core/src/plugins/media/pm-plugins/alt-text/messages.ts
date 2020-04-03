import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  altText: {
    id: 'fabric.editor.addAltText',
    defaultMessage: 'Alt text',
    description: 'Add an alt text for this image',
  },
  editAltText: {
    id: 'fabric.editor.editAltText',
    defaultMessage: 'Edit alt text',
    description: 'Edit an alt text for this image',
  },
  back: {
    id: 'fabric.editor.closeAltTextEdit',
    defaultMessage: 'Back',
    description: 'Back to toolbar',
  },
  clear: {
    id: 'fabric.editor.clearAltTextEdit',
    defaultMessage: 'Clear alt text',
    description: 'Clear alt text',
  },
  placeholder: {
    id: 'fabric.editor.placeholderAltText',
    defaultMessage: 'Describe this image with alt text',
    description: 'Describe this image with alt text',
  },
  supportText: {
    id: 'fabric.editor.supportAltText',
    defaultMessage:
      'Alt text is useful for people using screen readers because of visual limitations.',
    description:
      'Alt text is useful for people using screen readers because of visual limitations.',
  },
  validationMessage: {
    id: 'fabric.editor.alttext.validation',
    defaultMessage: 'Please remove any special characters in alt text.',
    description: 'Please remove any special characters in alt text. ',
  },
});
