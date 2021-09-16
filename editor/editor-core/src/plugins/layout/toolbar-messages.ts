import { defineMessages } from 'react-intl';

export const toolbarMessages = defineMessages({
  singleColumn: {
    id: 'fabric.editor.single',
    defaultMessage: 'Single column',
    description: 'Layout with one single column',
  },
  twoColumns: {
    id: 'fabric.editor.twoColumns',
    defaultMessage: 'Two columns',
    description: 'Layout with two columns of equal width',
  },
  threeColumns: {
    id: 'fabric.editor.threeColumns',
    defaultMessage: 'Three columns',
    description: 'Layout with three columns of equal width',
  },
  rightSidebar: {
    id: 'fabric.editor.rightSidebar',
    defaultMessage: 'Right sidebar',
    description:
      'Layout with two columns, left column is 2/3 and right is 1/3 of page',
  },
  leftSidebar: {
    id: 'fabric.editor.leftSidebar',
    defaultMessage: 'Left sidebar',
    description:
      'Layout with two columns, left column is 1/3 and right is 2/3 of page',
  },
  threeColumnsWithSidebars: {
    id: 'fabric.editor.threeColumnsWithSidebars',
    defaultMessage: 'Three columns with sidebars',
    description: 'Layout with 3 columns laid out as 25% - 50% - 25%',
  },
});
