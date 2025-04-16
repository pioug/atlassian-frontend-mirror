import type { JsonLd } from '@atlaskit/json-ld-types';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	ElementName,
	MediaPlacement,
	SmartLinkPosition,
	SmartLinkSize,
} from '../../../../constants';
import { extractOwnedBy } from '../../../../extractors/flexible/utils';
import { getExtensionKey } from '../../../../state/helpers';
import type { PreviewBlockProps } from '../../../FlexibleCard/components/blocks/preview-block/types';
import type { TitleBlockProps } from '../../../FlexibleCard/components/blocks/title-block/types';
import type { ElementItem } from '../../../FlexibleCard/components/blocks/types';
import { type InternalFlexibleUiOptions } from '../../../FlexibleCard/types';

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

export const getSimulatedBetterMetadata = (cardDetails?: JsonLd.Response): SimulatedMetadata => {
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
		case 'bitbucket-object-provider':
		case 'native-bitbucket-object-provider':
			const isFile = data['@type'].includes('schema:DigitalDocument');

			return {
				titleMetadata: defaultTitleMetadata,
				topMetadata: isFile
					? [
							{ name: ElementName.LatestCommit },
							{ name: ElementName.CollaboratorGroup },
							{ name: ElementName.ModifiedOn },
						]
					: defaultTopMetadata,
				bottomMetadata: defaultBottomMetadata,
			};
		case 'dragonfruit-object-provider':
			if (fg('expandable_smart_links_for_scorecards_v2')) {
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
			} else {
				return {
					titleMetadata: defaultTitleMetadata,
					topMetadata: defaultTopMetadata,
					bottomMetadata: defaultBottomMetadata,
				};
			}
		case 'confluence-object-provider':
			return {
				titleMetadata: defaultTitleMetadata,
				topMetadata: extractOwnedBy(data)
					? [{ name: ElementName.OwnedByGroup }, { name: ElementName.OwnedBy }, ...baseTopMetadata]
					: defaultTopMetadata,
				bottomMetadata: defaultBottomMetadata,
			};
		case 'jira-object-provider':
			const isJiraTask = data['@type']?.includes('atlassian:Task') ?? false;
			const isJiraPlan = !!data['atlassian:ownedBy'] ?? false;

			let topMetadata: ElementItem[] = [
				{ name: ElementName.AuthorGroup },
				{ name: ElementName.CreatedBy },
				{ name: ElementName.ModifiedOn },
			];

			if (isJiraTask) {
				topMetadata = [
					{ name: ElementName.AssignedToGroup },
					{ name: ElementName.AssignedTo },
					{ name: ElementName.ModifiedOn },
				];
			} else if (isJiraPlan && fg('smart_links_for_plans_platform')) {
				topMetadata = [{ name: ElementName.OwnedByGroup }, { name: ElementName.OwnedBy }];
			}

			return {
				titleMetadata: defaultTitleMetadata,
				topMetadata,
				bottomMetadata: [
					{ name: ElementName.StoryPoints },
					{ name: ElementName.Priority },
					{ name: ElementName.SubTasksProgress },
				],
			};
		case 'slack-object-provider':
			return {
				titleMetadata: defaultTitleMetadata,
				topMetadata: [{ name: ElementName.AuthorGroup }, { name: ElementName.SentOn }],
				bottomMetadata: [{ name: ElementName.ReactCount }, { name: ElementName.CommentCount }],
			};
		case 'trello-object-provider':
			return {
				titleMetadata: defaultTitleMetadata,
				topMetadata: [{ name: ElementName.CollaboratorGroup }, ...baseTopMetadata],
				bottomMetadata: defaultBottomMetadata,
			};
		default:
			return {
				titleMetadata: defaultTitleMetadata,
				topMetadata: defaultTopMetadata,
				bottomMetadata: defaultBottomMetadata,
			};
	}
};

type SimulatedMetadata = {
	titleMetadata: ElementItem[];
	topMetadata: ElementItem[];
	bottomMetadata?: ElementItem[];
};

export const FlexibleCardUiOptions: InternalFlexibleUiOptions = {
	hideElevation: true,
	hideLegacyButton: true,
};

export const titleBlockOptions: Partial<TitleBlockProps> = {
	anchorTarget: '_self',
	position: SmartLinkPosition.Center,
	hideRetry: true,
	size: SmartLinkSize.Large,
};

export const PreviewBlockOptions: Partial<PreviewBlockProps> = {
	placement: MediaPlacement.Right,
	ignoreContainerPadding: true,
};
