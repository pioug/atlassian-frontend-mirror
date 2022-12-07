import { JsonLd } from 'json-ld-types';
import { ElementName } from '../../constants';
import { LinkAction } from '../../state/hooks-external/useSmartLinkActions';
import { ElementItem } from '../FlexibleCard/components/blocks/types';

export const SMART_CARD_ANALYTICS_DISPLAY = 'flexible';

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

    case 'trello-object-provider':
      return {
        metadata: {
          primary: [
            ElementName.AuthorGroup,
            ElementName.State,
            ElementName.DueOn,
          ],
          secondary: [
            ElementName.ReactCount,
            ElementName.CommentCount,
            ElementName.AttachmentCount,
          ],
          subtitle: [],
        },
      };

    case 'watermelon-object-provider':
      if (types.includes('atlassian:Project')) {
        return {
          metadata: {
            primary: [
              ElementName.AuthorGroup,
              ElementName.ModifiedOn,
              ElementName.State,
              ElementName.DueOn,
            ],
            secondary: [],
            subtitle: [],
          },
        };
      }
      return {
        metadata: {
          primary: [
            ElementName.AuthorGroup,
            ElementName.State,
            ElementName.DueOn,
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

export const toActionableMetadata = (
  onActionClick: (actionId: string) => void,
  extensionKey?: string,
  types: JsonLd.Primitives.ObjectType[] = [],
  cardActions: LinkAction[] = [],
  elementItems: ElementItem[] = [],
) => {
  // Actionable State for Jira issue
  if (
    extensionKey === 'jira-object-provider' &&
    types?.includes('atlassian:Task')
  ) {
    const previewAction = cardActions.find(
      (action) => action.id === 'preview-content',
    );

    if (previewAction) {
      return elementItems.map((elementItem) =>
        elementItem.name === ElementName.State
          ? {
              ...elementItem,
              onClick: () => {
                if (onActionClick) {
                  onActionClick(previewAction.id);
                }
                return previewAction.invoke({ isReloadRequired: true });
              },
            }
          : elementItem,
      );
    }
  }
  return elementItems;
};
