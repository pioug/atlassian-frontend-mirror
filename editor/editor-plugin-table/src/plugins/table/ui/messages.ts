import { defineMessages } from 'react-intl-next';

export default defineMessages({
  insertColumn: {
    id: 'fabric.editor.insertColumn',
    defaultMessage: 'Insert column right',
    description: 'Inserts a new column to the right of selected column.',
  },
  removeColumns: {
    id: 'fabric.editor.removeColumns',
    defaultMessage: 'Delete {0, plural, one {column} other {columns}}',
    description: 'Deletes a table column.',
  },
  insertRow: {
    id: 'fabric.editor.insertRow',
    defaultMessage: 'Insert row below',
    description: 'Inserts a new row below the selected row.',
  },
  removeRows: {
    id: 'fabric.editor.removeRows',
    defaultMessage: 'Delete {0, plural, one {row} other {rows}}',
    description: 'Deletes a table row.',
  },
  cellOptions: {
    id: 'fabric.editor.cellOptions',
    defaultMessage: 'Cell options',
    description: 'Opens a menu with options for the current table cell.',
  },

  confirmDeleteLinkedModalOKButton: {
    id: 'fabric.editor.tables.confirmDeleteLinkedModalOKButton',
    defaultMessage: 'Delete',
    description:
      'Action button label for confirm modal when deleting a table linked to an extension.',
  },
  confirmDeleteLinkedModalMessage: {
    id: 'fabric.editor.tables.confirmDeleteLinkedModalMessage',
    defaultMessage: 'Deleting {nodeName} will break anything connected to it.',
    description:
      'Message for confirm modal when deleting a table linked to an extension.',
  },
  confirmDeleteLinkedModalMessagePrefix: {
    id: 'fabric.editor.extension.confirmDeleteLinkedModalMessagePrefix',
    defaultMessage: 'Deleting',
    description: 'prefix for confirmation dialog text',
  },
  confirmModalCheckboxLabel: {
    id: 'fabric.editor.floatingToolbar.confirmModalCheckboxLabel',
    defaultMessage: 'Also delete connected elements',
    description: 'checkbox label text',
  },
  deleteElementTitle: {
    id: 'fabric.editor.extension.deleteElementTitle',
    defaultMessage: 'Delete element',
    description:
      'Title text for confirm modal when deleting an extension linked to a data consumer.',
  },
  unnamedSource: {
    id: 'fabric.editor.extension.sourceNoTitledName',
    defaultMessage: 'this element',
    description: 'The current element without preset name been selected',
  },
  adjustColumns: {
    id: 'fabric.editor.tables.adjustColumn',
    defaultMessage: 'Adjust column',
    description: 'Tooltip displayed on table column resize handle',
  },
});
