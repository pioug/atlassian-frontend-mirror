import { type JsonLd } from 'json-ld-types';
import { ElementName } from '../../../constants';
import { getMetadata } from '../utils';
import {
	mockJiraResponse,
	mockConfluenceResponse,
	mockConfluenceResponseWithOwnedBy,
	mockBaseResponseWithPreview,
	mockBaseResponseAtlasProject,
	mockBBPullRequest,
	mockBBFile,
} from './__mocks__/mocks';

import { ffTest } from '@atlassian/feature-flags-test-utils';

describe('getMetadata', () => {
	ffTest.both(
		'platform.linking-platform.smart-card.hover-card-action-redesign',
		'returns hover card metadata based on extension key',
		() => {
			describe('for jira objects', () => {
				it('should return metadata elements only for top primary ', () => {
					const metadata = getMetadata(
						'jira-object-provider',
						mockJiraResponse.data as JsonLd.Data.BaseData,
					);
					expect(metadata).toEqual({
						primary: [
							{
								name: ElementName.AssignedToGroup,
								showNamePrefix: true,
								testId: 'assignedtogroup-metadata-element',
							},
							{
								name: ElementName.State,
								testId: 'state-metadata-element',
							},
							{
								name: ElementName.StoryPoints,
								testId: 'storypoints-metadata-element',
							},
							{
								name: ElementName.Priority,
								testId: 'priority-metadata-element',
							},
						],
					});
				});
			});

			describe('for Google objects', () => {
				it('should return metadata elements only for top primary ', () => {
					const metadata = getMetadata(
						'google-object-provider',
						mockBaseResponseWithPreview.data as JsonLd.Data.BaseData,
					);
					expect(metadata).toEqual({
						primary: [
							{
								name: ElementName.AuthorGroup,
								showNamePrefix: true,
								testId: 'authorgroup-metadata-element',
							},
							{
								name: ElementName.ModifiedOn,
								testId: 'modifiedon-metadata-element',
							},
						],
					});
				});
			});

			describe('for Figma objects', () => {
				it('should return metadata elements only for top primary ', () => {
					const metadata = getMetadata(
						'figma-object-provider',
						mockBaseResponseWithPreview.data as JsonLd.Data.BaseData,
					);
					expect(metadata).toEqual({
						primary: [
							{
								name: ElementName.AuthorGroup,
								showNamePrefix: true,
								testId: 'authorgroup-metadata-element',
							},
							{
								name: ElementName.ModifiedOn,
								testId: 'modifiedon-metadata-element',
							},
						],
					});
				});
			});

			describe('for Trello objects', () => {
				it('should return metadata elements for top primary, secondary & subtitles', () => {
					const metadata = getMetadata(
						'trello-object-provider',
						mockBaseResponseWithPreview.data as JsonLd.Data.BaseData,
					);
					expect(metadata).toEqual({
						subtitle: [
							{
								name: ElementName.Location,
								testId: 'location-metadata-element',
							},
						],
						primary: [
							{
								name: ElementName.CollaboratorGroup,
								testId: 'collaboratorgroup-metadata-element',
							},
							{ name: ElementName.State, testId: 'state-metadata-element' },
							{ name: ElementName.DueOn, testId: 'dueon-metadata-element' },
						],
						secondary: [
							{
								name: ElementName.ReactCount,
								testId: 'reactcount-metadata-element',
							},
							{
								name: ElementName.CommentCount,
								testId: 'commentcount-metadata-element',
							},
							{
								name: ElementName.AttachmentCount,
								testId: 'attachmentcount-metadata-element',
							},
							{
								name: ElementName.ChecklistProgress,
								testId: 'checklistprogress-metadata-element',
							},
						],
					});
				});
			});

			describe('for Atlas objects', () => {
				it('should return metadata elements for top primary, including ModifiedOn for Projects', () => {
					const metadata = getMetadata(
						'watermelon-object-provider',
						mockBaseResponseAtlasProject.data as JsonLd.Data.BaseData,
					);
					expect(metadata).toEqual({
						primary: [
							{
								name: ElementName.AuthorGroup,
								showNamePrefix: true,
								testId: 'authorgroup-metadata-element',
							},
							{
								name: ElementName.ModifiedOn,
								testId: 'modifiedon-metadata-element',
							},
							{ name: ElementName.State, testId: 'state-metadata-element' },
							{ name: ElementName.DueOn, testId: 'dueon-metadata-element' },
						],
					});
				});
				it('should return metadata elements for top primary, without ModifiedOn for Objects that are not Projects', () => {
					const metadata = getMetadata(
						'watermelon-object-provider',
						mockBaseResponseWithPreview.data as JsonLd.Data.BaseData,
					);
					expect(metadata).toEqual({
						primary: [
							{
								name: ElementName.AuthorGroup,
								showNamePrefix: true,
								testId: 'authorgroup-metadata-element',
							},
							{ name: ElementName.State, testId: 'state-metadata-element' },
							{ name: ElementName.DueOn, testId: 'dueon-metadata-element' },
						],
					});
				});
			});

			describe('for Bitbucket objects', () => {
				it('should return metadata elements for top primary, including ModifiedOn & subtitles for SourceCodePullRequest', () => {
					const metadata = getMetadata(
						'native-bitbucket-object-provider',
						mockBBPullRequest.data as JsonLd.Data.BaseData,
					);
					expect(metadata).toEqual({
						subtitle: [
							{
								name: ElementName.SourceBranch,
								testId: 'sourcebranch-metadata-element',
							},
							{
								name: ElementName.TargetBranch,
								testId: 'targetbranch-metadata-element',
							},
						],
						primary: [
							{
								name: ElementName.AuthorGroup,
								showNamePrefix: true,
								testId: 'authorgroup-metadata-element',
							},
							{
								name: ElementName.ModifiedOn,
								testId: 'modifiedon-metadata-element',
							},
							{
								name: ElementName.SubscriberCount,
								testId: 'subscribercount-metadata-element',
							},
							{ name: ElementName.State, testId: 'state-metadata-element' },
						],
					});
				});

				it('should return metadata elements for top primary, including CollaboratorGroup & LatestCommit for BB files', () => {
					const metadata = getMetadata(
						'native-bitbucket-object-provider',
						mockBBFile.data as JsonLd.Data.BaseData,
					);
					expect(metadata).toEqual({
						primary: [
							{
								name: ElementName.LatestCommit,
								testId: 'latestcommit-metadata-element',
							},
							{
								name: ElementName.CollaboratorGroup,
								testId: 'collaboratorgroup-metadata-element',
							},
							{
								name: ElementName.ModifiedOn,
								testId: 'modifiedon-metadata-element',
							},
						],
					});
				});

				it('should return metadata elements for top primary, without ModifiedOn for Objects that are not SourceCodePullRequest', () => {
					const metadata = getMetadata(
						'native-bitbucket-object-provider',
						mockBaseResponseWithPreview.data as JsonLd.Data.BaseData,
					);
					expect(metadata).toEqual({
						primary: [
							{
								name: ElementName.AuthorGroup,
								showNamePrefix: true,
								testId: 'authorgroup-metadata-element',
							},
							{
								name: ElementName.ModifiedOn,
								testId: 'modifiedon-metadata-element',
							},
						],
					});
				});
			});

			describe('for rest of providers != jira/Confluence/Atlas?Trello/BB', () => {
				it('should return metadata elements only for top primary', () => {
					const metadata = getMetadata(
						'random-object-provider',
						mockBaseResponseWithPreview.data as JsonLd.Data.BaseData,
					);
					expect(metadata).toEqual({
						primary: [
							{
								name: ElementName.AuthorGroup,
								showNamePrefix: true,
								testId: 'authorgroup-metadata-element',
							},
							{
								name: ElementName.ModifiedOn,
								testId: 'modifiedon-metadata-element',
							},
						],
					});
				});
			});
		},
	);

	ffTest.off(
		'platform.linking-platform.smart-card.hover-card-action-redesign',
		'returns hover card metadata based on extension key',
		() => {
			describe('for Confluence objects', () => {
				it('should return metadata elements for top primary with Author Group & bottom primary when no ownedBy is present', () => {
					const metadata = getMetadata(
						'confluence-object-provider',
						mockConfluenceResponse.data as JsonLd.Data.BaseData,
					);
					expect(metadata).toEqual({
						tertiary: [
							{
								name: ElementName.ReactCount,
								testId: 'reactcount-metadata-element',
							},
							{
								name: ElementName.CommentCount,
								testId: 'commentcount-metadata-element',
							},
							{
								name: ElementName.ViewCount,
								testId: 'viewcount-metadata-element',
							},
						],
						primary: [
							{
								name: ElementName.AuthorGroup,
								showNamePrefix: true,
								testId: 'authorgroup-metadata-element',
							},
							{
								name: ElementName.ModifiedOn,
								testId: 'modifiedon-metadata-element',
							},
						],
					});
				});

				it('should return ownedByGroup in top primary metadata when ownedBy is present', () => {
					const metadata = getMetadata(
						'confluence-object-provider',
						mockConfluenceResponseWithOwnedBy.data as JsonLd.Data.BaseData,
					);
					expect(metadata).toEqual({
						tertiary: [
							{
								name: ElementName.ReactCount,
								testId: 'reactcount-metadata-element',
							},
							{
								name: ElementName.CommentCount,
								testId: 'commentcount-metadata-element',
							},
							{
								name: ElementName.ViewCount,
								testId: 'viewcount-metadata-element',
							},
						],
						primary: [
							{
								name: ElementName.OwnedByGroup,
								showNamePrefix: true,
								testId: 'ownedbygroup-metadata-element',
							},
							{
								name: ElementName.ModifiedOn,
								testId: 'modifiedon-metadata-element',
							},
						],
					});
				});
			});

			describe('for Slack objects', () => {
				it('should return metadata elements for top primary only', () => {
					const metadata = getMetadata(
						'slack-object-provider',
						mockBaseResponseWithPreview.data as JsonLd.Data.BaseData,
					);
					expect(metadata).toEqual({
						tertiary: [
							{
								name: ElementName.ReactCount,
								testId: 'reactcount-metadata-element',
							},
							{
								name: ElementName.CommentCount,
								testId: 'commentcount-metadata-element',
							},
						],
						primary: [
							{
								name: ElementName.AuthorGroup,
								showNamePrefix: true,
								testId: 'authorgroup-metadata-element',
							},
							{ name: ElementName.SentOn, testId: 'senton-metadata-element' },
						],
					});
				});
			});
		},
	);

	ffTest.on(
		'platform.linking-platform.smart-card.hover-card-action-redesign',
		'returns hover card metadata based on extension key',
		() => {
			describe('for Confluence objects', () => {
				it('should return metadata elements for top primary with Author Group & bottom primary when no ownedBy is present', () => {
					const metadata = getMetadata(
						'confluence-object-provider',
						mockConfluenceResponse.data as JsonLd.Data.BaseData,
					);
					expect(metadata).toEqual({
						primary: [
							{
								name: ElementName.AuthorGroup,
								showNamePrefix: true,
								testId: 'authorgroup-metadata-element',
							},
							{
								name: ElementName.ModifiedOn,
								testId: 'modifiedon-metadata-element',
							},
							{
								name: ElementName.ReactCount,
								testId: 'reactcount-metadata-element',
							},
							{
								name: ElementName.CommentCount,
								testId: 'commentcount-metadata-element',
							},
							{
								name: ElementName.ViewCount,
								testId: 'viewcount-metadata-element',
							},
						],
					});
				});

				it('should return ownedByGroup in top primary metadata when ownedBy is present', () => {
					const metadata = getMetadata(
						'confluence-object-provider',
						mockConfluenceResponseWithOwnedBy.data as JsonLd.Data.BaseData,
					);
					expect(metadata).toEqual({
						primary: [
							{
								name: ElementName.OwnedByGroup,
								showNamePrefix: true,
								testId: 'ownedbygroup-metadata-element',
							},
							{
								name: ElementName.ModifiedOn,
								testId: 'modifiedon-metadata-element',
							},
							{
								name: ElementName.ReactCount,
								testId: 'reactcount-metadata-element',
							},
							{
								name: ElementName.CommentCount,
								testId: 'commentcount-metadata-element',
							},
							{
								name: ElementName.ViewCount,
								testId: 'viewcount-metadata-element',
							},
						],
					});
				});
			});

			describe('for Slack objects', () => {
				it('should return metadata elements for top primary only', () => {
					const metadata = getMetadata(
						'slack-object-provider',
						mockBaseResponseWithPreview.data as JsonLd.Data.BaseData,
					);
					expect(metadata).toEqual({
						primary: [
							{
								name: ElementName.AuthorGroup,
								showNamePrefix: true,
								testId: 'authorgroup-metadata-element',
							},
							{ name: ElementName.SentOn, testId: 'senton-metadata-element' },
							{
								name: ElementName.ReactCount,
								testId: 'reactcount-metadata-element',
							},
							{
								name: ElementName.CommentCount,
								testId: 'commentcount-metadata-element',
							},
						],
					});
				});
			});
		},
	);
});
