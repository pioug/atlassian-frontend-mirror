import { type JsonLd } from '@atlaskit/json-ld-types';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { ElementName } from '../../../../constants';
import { type ElementItem } from '../../../FlexibleCard/components/blocks/types';
import { getSimulatedBetterMetadata } from '../utils';

import {
	mockBaseResponse,
	mockBBFileResponse,
	mockConfluenceResponse,
	mockConfluenceResponseWithOwnedBy,
	mockJiraResponse,
} from './__mocks__/blockCardMocks';

describe('getSimulatedBetterMetadata', () => {
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

	const defaultTitleMetadata: ElementItem[] = [{ name: ElementName.State }];
	const defaultTopMetadata: ElementItem[] = [
		{ name: ElementName.AuthorGroup },
		{ name: ElementName.CreatedBy },
		...baseTopMetadata,
	];
	const defaultBottomMetadata = baseBottomMetaData;

	describe('for jira objects', () => {
		it('should return metadata elements only top primary & bottom primary jira task', () => {
			const metadata = getSimulatedBetterMetadata(mockJiraResponse as JsonLd.Response);
			const topMetadata = [
				{ name: ElementName.AssignedToGroup },
				{ name: ElementName.AssignedTo },
				{ name: ElementName.ModifiedOn },
			];
			const bottomMetadata = [
				{ name: ElementName.StoryPoints },
				{ name: ElementName.Priority },
				{ name: ElementName.SubTasksProgress },
			];
			expect(metadata.titleMetadata).toEqual(defaultTitleMetadata);
			expect(metadata.topMetadata).toEqual(topMetadata);
			expect(metadata.bottomMetadata).toEqual(bottomMetadata);
		});

		it('should return metadata elements only top primary & bottom primary ', () => {
			const metadata = getSimulatedBetterMetadata({
				...mockJiraResponse,
				data: {
					...mockJiraResponse.data,
					'@type': ['Object'],
				},
			} as JsonLd.Response);
			const topMetadata = [
				{ name: ElementName.AuthorGroup },
				{ name: ElementName.CreatedBy },
				{ name: ElementName.ModifiedOn },
			];

			const bottomMetadata = [
				{ name: ElementName.StoryPoints },
				{ name: ElementName.Priority },
				{ name: ElementName.SubTasksProgress },
			];
			expect(metadata.titleMetadata).toEqual(defaultTitleMetadata);
			expect(metadata.topMetadata).toEqual(topMetadata);
			expect(metadata.bottomMetadata).toEqual(bottomMetadata);
		});

		ffTest.on('smart_links_for_plans_platform', 'with smart links for plans enabled', () => {
			it('should return metadata elements only top primary & bottom primary for jira plan', () => {
				const metadata = getSimulatedBetterMetadata({
					...mockJiraResponse,
					data: {
						...mockJiraResponse.data,
						'@type': ['Object'],
						'atlassian:ownedBy': {
							'@type': 'Person',
							icon: {
								'@type': 'Image',
								url: 'avatar_url',
							},
							name: 'Michael Schrute',
						},
					},
				} as JsonLd.Response);
				const topMetadata = [{ name: ElementName.OwnedByGroup }, { name: ElementName.OwnedBy }];

				const bottomMetadata = [
					{ name: ElementName.StoryPoints },
					{ name: ElementName.Priority },
					{ name: ElementName.SubTasksProgress },
				];
				expect(metadata.titleMetadata).toEqual(defaultTitleMetadata);
				expect(metadata.topMetadata).toEqual(topMetadata);
				expect(metadata.bottomMetadata).toEqual(bottomMetadata);
			});
		});
	});

	describe('for Confluence objects', () => {
		it('should return metadata elements for top primary with Author Group & bottom primary when no ownedBy is present', () => {
			const metadata = getSimulatedBetterMetadata(mockConfluenceResponse as JsonLd.Response);
			expect(metadata.titleMetadata).toEqual(defaultTitleMetadata);
			expect(metadata.topMetadata).toEqual(defaultTopMetadata);
			expect(metadata.bottomMetadata).toEqual(defaultBottomMetadata);
		});
		it('should return ownedByGroup in top primary metadata when ownedBy is present', () => {
			const metadata = getSimulatedBetterMetadata(
				mockConfluenceResponseWithOwnedBy as JsonLd.Response,
			);
			expect(metadata.topMetadata).toEqual([
				{ name: ElementName.OwnedByGroup },
				{ name: ElementName.OwnedBy },
				...baseTopMetadata,
			]);
		});
	});

	describe('for Bitbucket objects', () => {
		it('should return correct metadata elements for BB files', () => {
			const metadata = getSimulatedBetterMetadata(mockBBFileResponse as JsonLd.Response);
			const topMetadata = [
				{ name: ElementName.LatestCommit },
				{ name: ElementName.CollaboratorGroup },
				{ name: ElementName.ModifiedOn },
			];

			expect(metadata.topMetadata).toEqual(topMetadata);
			expect(metadata.bottomMetadata).toEqual(defaultBottomMetadata);
		});
	});

	describe('for slack objects', () => {
		it('should return metadata elements only  top primary  ', () => {
			const metadata = getSimulatedBetterMetadata({
				...mockBaseResponse,
				meta: {
					...mockBaseResponse.meta,
					key: 'slack-object-provider',
				},
			} as JsonLd.Response);
			const topMetadata = [{ name: ElementName.AuthorGroup }, { name: ElementName.SentOn }];
			const bottomMetadata = [{ name: ElementName.ReactCount }, { name: ElementName.CommentCount }];
			expect(metadata.topMetadata).toEqual(topMetadata);
			expect(metadata.bottomMetadata).toEqual(bottomMetadata);
		});
	});

	describe('for rest of providers != jira/Confluence/', () => {
		it('should return default metadata for tirle & metadataBlocks', () => {
			const metadata = getSimulatedBetterMetadata(mockBaseResponse as JsonLd.Response);
			expect(metadata.titleMetadata).toEqual(defaultTitleMetadata);
			expect(metadata.topMetadata).toEqual(defaultTopMetadata);
			expect(metadata.bottomMetadata).toEqual(defaultBottomMetadata);
		});
	});
});
