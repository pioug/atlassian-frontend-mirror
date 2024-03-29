import { JsonLd } from 'json-ld-types';
import { ElementName } from '../../../constants';
import { getIsAISummaryEnabled, getSimulatedBetterMetadata } from '../utils';
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

describe('getSimulatedBetterMetadata', () => {
  const defaultBottomMetadata = {
    primary: [],
    secondary: [],
    subtitle: [],
  };
  describe('for jira objects', () => {
    it('should return metadata elements only for top primary ', () => {
      const metadata = getSimulatedBetterMetadata(
        'jira-object-provider',
        mockJiraResponse.data as JsonLd.Data.BaseData,
      );
      const topMetadata = [
        ElementName.AssignedToGroup,
        ElementName.State,
        ElementName.StoryPoints,
        ElementName.Priority,
      ];
      expect(metadata.topMetadataBlock.primary).toEqual(topMetadata);
      expect(metadata.topMetadataBlock.secondary).toBeEmpty;
      expect(metadata.topMetadataBlock.subtitle).toBeEmpty;
      expect(metadata.bottomMetadataBlock).toEqual(defaultBottomMetadata);
    });
  });

  describe('for Confluence objects', () => {
    it('should return metadata elements for top primary with Author Group & bottom primary when no ownedBy is present', () => {
      const metadata = getSimulatedBetterMetadata(
        'confluence-object-provider',
        mockConfluenceResponse.data as JsonLd.Data.BaseData,
      );
      const topMetadata = [ElementName.AuthorGroup, ElementName.ModifiedOn];
      const bottomPrimary = [
        ElementName.ReactCount,
        ElementName.CommentCount,
        ElementName.ViewCount,
      ];
      expect(metadata.topMetadataBlock.primary).toEqual(topMetadata);
      expect(metadata.topMetadataBlock.secondary).toBeEmpty;
      expect(metadata.topMetadataBlock.subtitle).toBeEmpty;
      expect(metadata.bottomMetadataBlock.primary).toEqual(bottomPrimary);
    });
    it('should return ownedByGroup in top primary metadata when ownedBy is present', () => {
      const metadata = getSimulatedBetterMetadata(
        'confluence-object-provider',
        mockConfluenceResponseWithOwnedBy.data as JsonLd.Data.BaseData,
      );
      expect(metadata.topMetadataBlock.primary).toContain(
        ElementName.OwnedByGroup,
      );
    });
  });

  describe('for Google objects', () => {
    it('should return metadata elements only for top primary ', () => {
      const metadata = getSimulatedBetterMetadata(
        'google-object-provider',
        mockBaseResponseWithPreview.data as JsonLd.Data.BaseData,
      );
      const topMetadata = [ElementName.AuthorGroup, ElementName.ModifiedOn];

      expect(metadata.topMetadataBlock.primary).toEqual(topMetadata);
      expect(metadata.topMetadataBlock.secondary).toBeEmpty;
      expect(metadata.topMetadataBlock.subtitle).toBeEmpty;
      expect(metadata.bottomMetadataBlock).toEqual(defaultBottomMetadata);
    });
  });
  describe('for Figma objects', () => {
    it('should return metadata elements only for top primary ', () => {
      const metadata = getSimulatedBetterMetadata(
        'figma-object-provider',
        mockBaseResponseWithPreview.data as JsonLd.Data.BaseData,
      );
      const topMetadata = [ElementName.AuthorGroup, ElementName.ModifiedOn];

      expect(metadata.topMetadataBlock.primary).toEqual(topMetadata);
      expect(metadata.topMetadataBlock.secondary).toBeEmpty;
      expect(metadata.topMetadataBlock.subtitle).toBeEmpty;
      expect(metadata.bottomMetadataBlock).toEqual(defaultBottomMetadata);
    });
  });

  describe('for Trello objects', () => {
    it('should return metadata elements for top primary, secondary & subtitles', () => {
      const metadata = getSimulatedBetterMetadata(
        'trello-object-provider',
        mockBaseResponseWithPreview.data as JsonLd.Data.BaseData,
      );
      const topMetadata = {
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
      };

      expect(metadata.topMetadataBlock).toEqual(topMetadata);
      expect(metadata.bottomMetadataBlock).toEqual(defaultBottomMetadata);
    });
  });

  describe('for Atlas objects', () => {
    it('should return metadata elements for top primary, including ModifiedOn for Projects', () => {
      const metadata = getSimulatedBetterMetadata(
        'watermelon-object-provider',
        mockBaseResponseAtlasProject.data as JsonLd.Data.BaseData,
      );
      const topMetadata = {
        primary: [
          ElementName.AuthorGroup,
          ElementName.ModifiedOn,
          ElementName.State,
          ElementName.DueOn,
        ],
        secondary: [],
        subtitle: [],
      };

      expect(metadata.topMetadataBlock).toEqual(topMetadata);
      expect(metadata.bottomMetadataBlock).toEqual(defaultBottomMetadata);
    });
    it('should return metadata elements for top primary, without ModifiedOn for Objects that are not Projects', () => {
      const metadata = getSimulatedBetterMetadata(
        'watermelon-object-provider',
        mockBaseResponseWithPreview.data as JsonLd.Data.BaseData,
      );
      const topMetadata = {
        primary: [
          ElementName.AuthorGroup,
          ElementName.State,
          ElementName.DueOn,
        ],
        secondary: [],
        subtitle: [],
      };
      expect(metadata.topMetadataBlock).toEqual(topMetadata);
      expect(metadata.bottomMetadataBlock).toEqual(defaultBottomMetadata);
    });
  });

  describe('for Bitbucket objects', () => {
    it('should return metadata elements for top primary, including ModifiedOn & subtitles for SourceCodePullRequest', () => {
      const metadata = getSimulatedBetterMetadata(
        'native-bitbucket-object-provider',
        mockBBPullRequest.data as JsonLd.Data.BaseData,
      );
      const topMetadata = {
        primary: [
          ElementName.AuthorGroup,
          ElementName.ModifiedOn,
          ElementName.SubscriberCount,
          ElementName.State,
        ],
        secondary: [],
        subtitle: [ElementName.SourceBranch, ElementName.TargetBranch],
      };

      expect(metadata.topMetadataBlock).toEqual(topMetadata);
      expect(metadata.bottomMetadataBlock).toEqual(defaultBottomMetadata);
    });
    describe('should return metadata elements for top primary, including CollaboratorGroup & LatestCommit for BB files', () => {
      ffTest(
        'platform.linking-platform.extractor.improve-bitbucket-file-links',
        () => {
          const metadata = getSimulatedBetterMetadata(
            'native-bitbucket-object-provider',
            mockBBFile.data as JsonLd.Data.BaseData,
          );
          const topMetadata = {
            primary: [
              ElementName.LatestCommit,
              ElementName.CollaboratorGroup,
              ElementName.ModifiedOn,
            ],
            secondary: [],
            subtitle: [],
          };

          expect(metadata.topMetadataBlock).toEqual(topMetadata);
          expect(metadata.bottomMetadataBlock).toEqual(defaultBottomMetadata);
        },
        () => {
          const metadata = getSimulatedBetterMetadata(
            'native-bitbucket-object-provider',
            mockBBFile.data as JsonLd.Data.BaseData,
          );
          const topMetadata = {
            primary: [ElementName.AuthorGroup, ElementName.ModifiedOn],
            secondary: [],
            subtitle: [],
          };
          expect(metadata.topMetadataBlock).toEqual(topMetadata);
          expect(metadata.bottomMetadataBlock).toEqual(defaultBottomMetadata);
        },
      );
    });
    it('should return metadata elements for top primary, without ModifiedOn for Objects that are not SourceCodePullRequest', () => {
      const metadata = getSimulatedBetterMetadata(
        'native-bitbucket-object-provider',
        mockBaseResponseWithPreview.data as JsonLd.Data.BaseData,
      );
      const topMetadata = {
        primary: [ElementName.AuthorGroup, ElementName.ModifiedOn],
        secondary: [],
        subtitle: [],
      };
      expect(metadata.topMetadataBlock).toEqual(topMetadata);
      expect(metadata.bottomMetadataBlock).toEqual(defaultBottomMetadata);
    });
  });

  describe('for Slack objects', () => {
    it('should return metadata elements for top primary only', () => {
      const metadata = getSimulatedBetterMetadata(
        'slack-object-provider',
        mockBaseResponseWithPreview.data as JsonLd.Data.BaseData,
      );
      const topMetadataPrimary = [ElementName.AuthorGroup, ElementName.SentOn];
      const bottomPrimary = [ElementName.ReactCount, ElementName.CommentCount];

      expect(metadata.topMetadataBlock.primary).toEqual(topMetadataPrimary);
      expect(metadata.bottomMetadataBlock.primary).toEqual(bottomPrimary);
    });
  });

  describe('for rest of providers != jira/Confluence/Atlas?Trello/BB', () => {
    it('should return metadata elements only for top primary', () => {
      const metadata = getSimulatedBetterMetadata(
        'random-object-provider',
        mockBaseResponseWithPreview.data as JsonLd.Data.BaseData,
      );
      const topMetadata = {
        primary: [ElementName.AuthorGroup, ElementName.ModifiedOn],
        secondary: [],
        subtitle: [],
      };

      expect(metadata.topMetadataBlock).toEqual(topMetadata);
      expect(metadata.bottomMetadataBlock).toEqual(defaultBottomMetadata);
    });
  });
});

describe('getIsAISummaryEnabled', () => {
  const getMockResponse = (meta: Partial<JsonLd.Meta.BaseMeta> = {}) =>
    ({
      ...mockConfluenceResponse,
      meta: {
        ...mockConfluenceResponse.meta,
        ...meta,
      },
    } as JsonLd.Response);

  describe('returns false when AI is disabled', () => {
    const response = getMockResponse({ supportedFeature: ['AISummary'] });

    ffTest(
      'platform.linking-platform.smart-card.hover-card-ai-summaries',
      () => {
        const isAISummaryEnabled = getIsAISummaryEnabled(false, response);
        expect(isAISummaryEnabled).toBe(false);
      },
      () => {
        const isAISummaryEnabled = getIsAISummaryEnabled(false, response);
        expect(isAISummaryEnabled).toBe(false);
      },
    );
  });

  describe('when AI is enabled', () => {
    describe('returns true when AISummary is included in supportedFeatures', () => {
      const response = getMockResponse({ supportedFeature: ['AISummary'] });

      ffTest(
        'platform.linking-platform.smart-card.hover-card-ai-summaries',
        () => {
          const isAISummaryEnabled = getIsAISummaryEnabled(true, response);
          expect(isAISummaryEnabled).toBe(true);
        },
        () => {
          const isAISummaryEnabled = getIsAISummaryEnabled(true, response);
          expect(isAISummaryEnabled).toBe(false);
        },
      );
    });

    describe('returns false when AISummary is not included in supportedFeatures', () => {
      const response = getMockResponse({ supportedFeature: [] });

      ffTest(
        'platform.linking-platform.smart-card.hover-card-ai-summaries',
        () => {
          const isAISummaryEnabled = getIsAISummaryEnabled(true, response);
          expect(isAISummaryEnabled).toBe(false);
        },
      );
    });

    describe('returns false when link does not have supportedFeatures', () => {
      const response = getMockResponse();

      ffTest(
        'platform.linking-platform.smart-card.hover-card-ai-summaries',
        () => {
          const isAISummaryEnabled = getIsAISummaryEnabled(true, response);
          expect(isAISummaryEnabled).toBe(false);
        },
      );
    });
  });
});
