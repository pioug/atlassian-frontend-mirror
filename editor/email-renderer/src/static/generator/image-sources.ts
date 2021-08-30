// Although actual images are rendered at 16x16, we
// use 48x48 to account for scaling on high res screens

export default [
  // panel
  {
    name: 'info',
    input: 'info',
    exportSize: '48:48',
  },
  {
    name: 'note',
    input: 'note',
    exportSize: '48:48',
  },
  {
    name: 'tip',
    input: 'tip',
    exportSize: '48:48',
  },
  {
    name: 'success',
    input: 'success',
    exportSize: '48:48',
  },
  {
    name: 'warning',
    input: 'warning',
    exportSize: '48:48',
  },
  {
    name: 'error',
    input: 'error',
    exportSize: '48:48',
  },
  {
    name: 'custom',
    input: 'info',
    exportSize: '48:48',
  },

  // decision
  {
    name: 'decision',
    input: 'decision',
    exportSize: '48:48',
  },

  // taskItem
  {
    name: 'taskItemChecked',
    input: 'action-selected',
    exportSize: '48:48',
  },
  {
    name: 'taskItemUnchecked',
    input: 'action-default',
    exportSize: '48:48',
  },
  {
    name: 'genericAttachment',
    input: 'generic-attachment',
    exportSize: '28:28',
  },
  {
    name: 'audioAttachment',
    input: 'audio-attachment',
    exportSize: '28:28',
  },
  {
    name: 'videoAttachment',
    input: 'video-attachment',
    exportSize: '28:28',
  },
  {
    name: 'archiveAttachment',
    input: 'archive-attachment',
    exportSize: '28:28',
  },
  {
    name: 'documentAttachment',
    input: 'document-attachment',
    exportSize: '28:28',
  },
  {
    name: 'expand',
    input: 'expand',
    exportSize: '24:24',
  },
];
