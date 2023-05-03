import { JsonLd } from 'json-ld-types';
import { ElementName } from '../../constants';
import { LinkAction } from '../../state/hooks-external/useSmartLinkActions';
import { ElementItem } from '../FlexibleCard/components/blocks/types';
import { extractType } from '@atlaskit/linking-common/extractors';
import { extractOwnedBy } from '../../extractors/flexible/utils';

export const getSimulatedMetadata = (
  extensionKey: string = '',
  data: JsonLd.Data.BaseData,
): JsonLd.Primitives.Property<any> => {
  const types = data ? extractType(data) : undefined;

  switch (extensionKey) {
    case 'bitbucket-object-provider':
    case 'native-bitbucket-object-provider':
      if (types?.includes('atlassian:SourceCodePullRequest')) {
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
      const primaryAttribution =
        data && extractOwnedBy(data)
          ? ElementName.OwnedBy
          : ElementName.CreatedBy;
      return {
        metadata: {
          primary: [ElementName.AuthorGroup, primaryAttribution],
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
            ElementName.ChecklistProgress,
          ],
          subtitle: [ElementName.Location],
        },
      };

    case 'watermelon-object-provider':
      if (types?.includes('atlassian:Project')) {
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
