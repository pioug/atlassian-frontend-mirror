import { type JsonLd } from 'json-ld-types';
import { ElementName } from '../../../../../constants';
import { type ElementItem } from '../../../../FlexibleCard/components/blocks/types';
import { getSimulatedBetterMetadata } from '../utils';
import {
	mockJiraResponse,
	mockBaseResponse,
	mockConfluenceResponse,
	mockConfluenceResponseWithOwnedBy,
	mockBBFileResponse,
} from './__mocks__/blockCardMocks';

import { ffTest } from '@atlassian/feature-flags-test-utils';

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
		it('should return metadata elements only  top primary & bottom primary ', () => {
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
		describe('should return correct metadata elements for BB files', () => {
			ffTest(
				'platform.linking-platform.extractor.improve-bitbucket-file-links',
				() => {
					const metadata = getSimulatedBetterMetadata(mockBBFileResponse as JsonLd.Response);
					const topMetadata = [
						{ name: ElementName.LatestCommit },
						{ name: ElementName.CollaboratorGroup },
						{ name: ElementName.ModifiedOn },
					];

					expect(metadata.topMetadata).toEqual(topMetadata);
					expect(metadata.bottomMetadata).toEqual(defaultBottomMetadata);
				},
				() => {
					const metadata = getSimulatedBetterMetadata(mockBBFileResponse as JsonLd.Response);
					expect(metadata.topMetadata).toEqual(defaultTopMetadata);
					expect(metadata.bottomMetadata).toEqual(defaultBottomMetadata);
				},
			);
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
