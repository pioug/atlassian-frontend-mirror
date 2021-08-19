import { defineMessages, InjectedIntl } from 'react-intl';

const messages = defineMessages({
  story: {
    id: 'fabric.editor.story',
    defaultMessage: 'Story',
    description: 'Alt text for Story',
  },
  epic: {
    id: 'fabric.editor.epic',
    defaultMessage: 'Epic',
    description: 'Alt text for Epic',
  },
  task: {
    id: 'fabric.editor.task',
    defaultMessage: 'Task',
    description: 'Alt text for Task',
  },
  bug: {
    id: 'fabric.editor.bug',
    defaultMessage: 'Bug',
    description: 'Alt text for Bug',
  },
  subTask: {
    id: 'fabric.editor.subTask',
    defaultMessage: 'Sub-task',
    description: 'Alt text for Sub-task',
  },
  improvement: {
    id: 'fabric.editor.improvement',
    defaultMessage: 'Improvement',
    description: 'Alt text for Improvement',
  },
  defaultAltText: {
    id: 'fabric.editor.defaultAltText',
    defaultMessage: 'List item',
    description: 'Default alt text for ListItem image',
  },
});

// Workaround to get alt text for images from url
// Can be removed when alt={iconAlt} will be available from GraphQL
export const getCorrectAltByIconUrl = (iconUrl: string, intl: InjectedIntl) => {
  let alt = intl.formatMessage(messages.defaultAltText);

  if (iconUrl.includes('story.svg')) {
    alt = intl.formatMessage(messages.story);
  }

  if (iconUrl.includes('epic.svg')) {
    alt = intl.formatMessage(messages.epic);
  }

  if (iconUrl.includes('avatarId=10318')) {
    alt = intl.formatMessage(messages.task);
  }

  if (iconUrl.includes('avatarId=10303')) {
    alt = intl.formatMessage(messages.bug);
  }

  if (iconUrl.includes('avatarId=10518')) {
    alt = intl.formatMessage(messages.subTask);
  }

  if (iconUrl.includes('avatarId=10310')) {
    alt = intl.formatMessage(messages.improvement);
  }

  return alt;
};
