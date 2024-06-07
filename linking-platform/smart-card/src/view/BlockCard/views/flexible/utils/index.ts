import type { JsonLd } from 'json-ld-types';
import {
	ElementName,
	MediaPlacement,
	SmartLinkPosition,
	SmartLinkSize,
} from '../../../../../constants';
import type { FlexibleUiOptions } from '../../../../FlexibleCard/types';
import type { FooterBlockProps } from '../../../../FlexibleCard/components/blocks/footer-block/types';
import type { PreviewBlockProps } from '../../../../FlexibleCard/components/blocks/preview-block/types';
import type { TitleBlockProps } from '../../../../FlexibleCard/components/blocks/title-block/types';
import type { ElementItem } from '../../../../FlexibleCard/components/blocks/types';
import { extractOwnedBy } from '../../../../../extractors/flexible/utils';
import { getExtensionKey } from '../../../../../state/helpers';
import { footerBlockCss, titleBlockCss } from '../styled';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

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
				topMetadata:
					getBooleanFF('platform.linking-platform.extractor.improve-bitbucket-file-links') && isFile
						? [
								{ name: ElementName.LatestCommit },
								{ name: ElementName.CollaboratorGroup },
								{ name: ElementName.ModifiedOn },
							]
						: defaultTopMetadata,
				bottomMetadata: defaultBottomMetadata,
			};
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

export const FlexibleCardUiOptions: FlexibleUiOptions = { hideElevation: true };

export const titleBlockOptions: Partial<TitleBlockProps> = {
	anchorTarget: '_self',
	position: SmartLinkPosition.Center,
	overrideCss: titleBlockCss,
	hideRetry: true,
	size: SmartLinkSize.Large,
};

export const PreviewBlockOptions: Partial<PreviewBlockProps> = {
	placement: MediaPlacement.Right,
	ignoreContainerPadding: true,
};

export const FooterBlockOptions: Partial<FooterBlockProps> = {
	overrideCss: footerBlockCss,
};
