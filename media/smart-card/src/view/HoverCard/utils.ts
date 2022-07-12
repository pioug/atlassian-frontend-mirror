import { JsonLd } from 'json-ld-types';
import { ElementName } from '../../constants';

export const HOVER_CARD_ANALYTICS_DISPLAY = 'flexible';

export const getSimulatedMetadata = (
  extensionKey: string = '',
  types: JsonLd.Primitives.ObjectType[] = [],
): JsonLd.Primitives.Property<any> => {
  switch (extensionKey) {
    case 'bitbucket-object-provider':
    case 'native-bitbucket-object-provider':
      if (types.includes('atlassian:SourceCodePullRequest')) {
        return {
          metadata: {
            primary: [
              ElementName.AuthorGroup,
              ElementName.ModifiedOn,
              ElementName.SubscriberCount,
              ElementName.State,
            ],
            secondary: [],
            subtitle: [ElementName.SourceBranch, ElementName.TargetBranch],
          },
        };
      }
      return {
        metadata: {
          primary: [ElementName.ModifiedOn, ElementName.CreatedBy],
          secondary: [],
          subtitle: [],
        },
      };
    case 'confluence-object-provider':
      return {
        metadata: {
          primary: [ElementName.AuthorGroup, ElementName.CreatedBy],
          secondary: [ElementName.CommentCount, ElementName.ReactCount],
          subtitle: [],
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
          subtitle: [],
        },
      };

    default:
      return {
        metadata: {
          primary: [ElementName.ModifiedOn, ElementName.CreatedBy],
          secondary: [],
          subtitle: [],
        },
      };
  }
};
