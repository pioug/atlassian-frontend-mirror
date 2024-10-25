import type { JsonLd } from 'json-ld-types';

import { extractType } from '@atlaskit/link-extractors';

import { ElementName } from '../../constants';
import { extractOwnedBy } from '../../extractors/flexible/utils';
import type { ElementItem } from '../FlexibleCard/components/blocks/types';

const getSimulatedBetterMetadata = (
	extensionKey?: string,
	data?: JsonLd.Data.BaseData,
): JsonLd.Primitives.Property<any> => {
	const types = data ? extractType(data) : undefined;
	const defaultMetadata = {
		primary: [ElementName.AuthorGroup, ElementName.ModifiedOn],
	};

	switch (extensionKey) {
		case 'bitbucket-object-provider':
		case 'native-bitbucket-object-provider':
			if (types?.includes('atlassian:SourceCodePullRequest')) {
				return {
					primary: [
						ElementName.AuthorGroup,
						ElementName.ModifiedOn,
						ElementName.SubscriberCount,
						ElementName.State,
					],
					subtitle: [ElementName.SourceBranch, ElementName.TargetBranch],
				};
			}
			if (types?.includes('schema:DigitalDocument')) {
				return {
					primary: [
						ElementName.LatestCommit,
						ElementName.CollaboratorGroup,
						ElementName.ModifiedOn,
					],
				};
			}
			return {
				primary: [ElementName.AuthorGroup, ElementName.ModifiedOn],
			};
		case 'confluence-object-provider':
			const primaryAttribution =
				data && extractOwnedBy(data) ? ElementName.OwnedByGroup : ElementName.AuthorGroup;
			return {
				primary: [primaryAttribution, ElementName.ModifiedOn],
				tertiary: [ElementName.ReactCount, ElementName.CommentCount, ElementName.ViewCount],
			};
		case 'jira-object-provider':
			const isJiraTask = data?.['@type']?.includes('atlassian:Task') ?? false;

			return {
				...defaultMetadata,
				...(isJiraTask && {
					primary: [
						ElementName.AssignedToGroup,
						ElementName.State,
						ElementName.StoryPoints,
						ElementName.Priority,
					],
				}),
			};
		case 'trello-object-provider':
			return {
				primary: [ElementName.CollaboratorGroup, ElementName.State, ElementName.DueOn],
				secondary: [
					ElementName.ReactCount,
					ElementName.CommentCount,
					ElementName.AttachmentCount,
					ElementName.ChecklistProgress,
				],
				subtitle: [ElementName.Location],
			};
		case 'watermelon-object-provider':
			if (types?.includes('atlassian:Project')) {
				return {
					primary: [
						ElementName.AuthorGroup,
						ElementName.ModifiedOn,
						ElementName.State,
						ElementName.DueOn,
					],
				};
			}
			return {
				primary: [ElementName.AuthorGroup, ElementName.State, ElementName.DueOn],
			};
		case 'slack-object-provider':
			return {
				primary: [ElementName.AuthorGroup, ElementName.SentOn],
				tertiary: [ElementName.ReactCount, ElementName.CommentCount],
			};
		case 'google-object-provider':
		case 'figma-object-provider':
			return {
				primary: [ElementName.AuthorGroup, ElementName.ModifiedOn],
			};
		default:
			return defaultMetadata;
	}
};

const AvatarGroupsWithNamePrefix = [
	ElementName.AssignedToGroup,
	ElementName.OwnedByGroup,
	ElementName.AuthorGroup,
];

const toElementItem = (name: ElementName): ElementItem => {
	const showNamePrefix = AvatarGroupsWithNamePrefix.indexOf(name) !== -1 ? true : undefined;
	const testId = `${name.toLowerCase()}-metadata-element`;
	return { name, showNamePrefix, testId } as ElementItem;
};

const toElementItems = (elementNames: ElementName[]): ElementItem[] | undefined => {
	if (!elementNames?.length) {
		return;
	}
	return elementNames.filter((name) => name in ElementName).map(toElementItem);
};

export const getMetadata = (extensionKey?: string, data?: JsonLd.Data.BaseData) => {
	const metadata = getSimulatedBetterMetadata(extensionKey, data);

	const primary = [].concat(metadata.primary, metadata.tertiary);

	return {
		subtitle: toElementItems(metadata.subtitle),
		primary: toElementItems(primary),
		secondary: toElementItems(metadata.secondary),
	};
};
