import { defineMessages } from 'react-intl-next';

export const tasksAndDecisionsMessages = defineMessages({
  taskPlaceholder: {
    id: 'fabric.editor.taskPlaceholder',
    defaultMessage: "Type your action, use '@' to assign to someone.",
    description:
      'Placeholder description for an empty action/task in the editor',
  },
  decisionPlaceholder: {
    id: 'fabric.editor.decisionPlaceholder',
    defaultMessage: 'Add a decision…',
    description: 'Placeholder description for an empty decision in the editor',
  },
});
