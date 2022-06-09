import { JsonLd } from 'json-ld-types';

export const HOVER_CARD_ANALYTICS_DISPLAY = 'flexible';

export const getSimulatedMetadata = (
  extensionKey: string = '',
): JsonLd.Primitives.Property<any> => {
  switch (extensionKey) {
    case 'confluence-object-provider':
      return {
        metadata: {
          primary: ['AuthorGroup', 'CreatedBy', 'CommentCount', 'ReactCount'],
          secondary: [],
        },
      };
    case 'jira-object-provider':
      return {
        metadata: {
          primary: ['AuthorGroup', 'State', 'Priority'],
          secondary: [],
        },
      };
    default:
      return {
        metadata: {
          primary: ['ModifiedOn'],
          secondary: [],
        },
      };
  }
};
