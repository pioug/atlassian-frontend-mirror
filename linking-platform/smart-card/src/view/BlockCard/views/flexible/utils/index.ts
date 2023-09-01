import { JsonLd } from 'json-ld-types';
import { ElementName } from '../../../../../constants';
import { ElementItem } from '../../../../FlexibleCard/components/blocks/types';
import { extractOwnedBy } from '../../../../../extractors/flexible/utils';
import { getExtensionKey } from '../../../../../state/helpers';

const baseTopMetadata: ElementItem[] = [
  { name: ElementName.ModifiedOn },
  { name: ElementName.AttachmentCount },
  { name: ElementName.SubscriberCount },
  { name: ElementName.VoteCount },
  { name: ElementName.DueOn },
  { name: ElementName.ReadTime },
];

const baseBottomMetaData: ElementItem[] = [
  { name: ElementName.ReactCount },
  { name: ElementName.CommentCount },
  { name: ElementName.ViewCount },
  { name: ElementName.Priority },
  { name: ElementName.SubTasksProgress },
  { name: ElementName.ChecklistProgress },
];

export const getSimulatedBetterMetadata = (
  cardDetails?: JsonLd.Response,
): SimulatedMetadata => {
  const extensionKey = getExtensionKey(cardDetails) ?? '';
  const data = cardDetails?.data as JsonLd.Data.BaseData;

  const defaultTitleMetadata: ElementItem[] = [{ name: ElementName.State }];
  const defaultTopMetadata: ElementItem[] = [
    { name: ElementName.AuthorGroup },
    { name: ElementName.CreatedBy },
    ...baseTopMetadata,
  ];
  const defaultBottomMetadata = baseBottomMetaData;

  switch (extensionKey) {
    case 'confluence-object-provider':
      return {
        titleMetadata: defaultTitleMetadata,
        topMetadata: extractOwnedBy(data)
          ? [
              { name: ElementName.OwnedByGroup },
              { name: ElementName.OwnedBy },
              ...baseTopMetadata,
            ]
          : defaultTopMetadata,
        bottomMetadata: defaultBottomMetadata,
      };
    case 'jira-object-provider':
      const isJiraTask = data['@type']?.includes('atlassian:Task') ?? false;
      return {
        titleMetadata: defaultTitleMetadata,
        topMetadata: isJiraTask
          ? [
              { name: ElementName.AssignedToGroup },
              { name: ElementName.AssignedTo },
              { name: ElementName.ModifiedOn },
            ]
          : [
              { name: ElementName.AuthorGroup },
              { name: ElementName.CreatedBy },
              { name: ElementName.ModifiedOn },
            ],
        bottomMetadata: [
          { name: ElementName.StoryPoints },
          { name: ElementName.Priority },
          { name: ElementName.SubTasksProgress },
        ],
      };
    case 'slack-object-provider':
      return {
        titleMetadata: defaultTitleMetadata,
        topMetadata: [
          { name: ElementName.AuthorGroup },
          { name: ElementName.SentOn },
        ],
        bottomMetadata: [
          { name: ElementName.ReactCount },
          { name: ElementName.CommentCount },
        ],
      };
    default:
      return {
        titleMetadata: defaultTitleMetadata,
        topMetadata: defaultTopMetadata,
        bottomMetadata: defaultBottomMetadata,
      };
  }
};

export const getSimulatedMetadata = (
  cardDetails?: JsonLd.Response,
): SimulatedMetadata => {
  const baseMetadata: ElementItem[] = [
    { name: ElementName.ModifiedOn },
    { name: ElementName.AttachmentCount },
    { name: ElementName.CommentCount },
    { name: ElementName.ReactCount },
    { name: ElementName.SubscriberCount },
    { name: ElementName.ViewCount },
    { name: ElementName.VoteCount },
    { name: ElementName.ChecklistProgress },
    { name: ElementName.DueOn },
  ];
  const topMetadata: ElementItem[] =
    cardDetails?.data &&
    extractOwnedBy(cardDetails?.data as JsonLd.Data.BaseData)
      ? [{ name: ElementName.OwnedBy }, ...baseMetadata]
      : [{ name: ElementName.ModifiedBy }, ...baseMetadata];

  const titleMetadata: ElementItem[] = [
    { name: ElementName.AuthorGroup },
    { name: ElementName.Priority },
    { name: ElementName.State },
  ];
  return {
    titleMetadata,
    topMetadata,
  };
};

type SimulatedMetadata = {
  titleMetadata: ElementItem[];
  topMetadata: ElementItem[];
  bottomMetadata?: ElementItem[];
};
