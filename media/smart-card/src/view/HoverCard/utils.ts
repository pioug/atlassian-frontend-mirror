import { JsonLd } from 'json-ld-types';
import { ElementName } from '../../constants';

export const HOVER_CARD_ANALYTICS_DISPLAY = 'flexible';

export const getSimulatedMetadata = (
  extensionKey: string = '',
): JsonLd.Primitives.Property<any> => {
  switch (extensionKey) {
    case 'confluence-object-provider':
      return {
        metadata: {
          primary: [
            ElementName.AuthorGroup,
            ElementName.CreatedBy,
            ElementName.CommentCount,
            ElementName.ReactCount,
          ],
          secondary: [],
        },
      };
    case 'jira-object-provider':
      return {
        metadata: {
          primary: [
            ElementName.AuthorGroup,
            ElementName.State,
            ElementName.Priority,
          ],
          secondary: [],
        },
      };
    default:
      return {
        metadata: {
          primary: [ElementName.ModifiedOn, ElementName.CreatedBy],
          secondary: [],
        },
      };
  }
};
