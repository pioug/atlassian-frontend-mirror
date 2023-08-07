import { JsonLd } from 'json-ld-types';
import { ElementName } from '../../../../../constants';
import { ElementItem } from '../../../../FlexibleCard/components/blocks/types';
import { getSimulatedBetterMetadata, getSimulatedMetadata } from '../utils';
import {
  mockJiraResponse,
  mockBaseResponse,
  mockConfluenceResponse,
  mockConfluenceResponseWithOwnedBy,
} from './__mocks__/mocks';

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
      const metadata = getSimulatedBetterMetadata(
        mockJiraResponse as JsonLd.Response,
      );
      const topMetadata = [
        { name: ElementName.AssignedToGroup },
        { name: ElementName.AssignedTo },
        { name: ElementName.ModifiedOn },
      ];
      const bottomMetadata = [
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
      const metadata = getSimulatedBetterMetadata(
        mockConfluenceResponse as JsonLd.Response,
      );
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

  describe('for rest of providers != jira/Confluence/', () => {
    it('should return default metadata for tirle & metadataBlocks', () => {
      const metadata = getSimulatedBetterMetadata(
        mockBaseResponse as JsonLd.Response,
      );
      expect(metadata.titleMetadata).toEqual(defaultTitleMetadata);
      expect(metadata.topMetadata).toEqual(defaultTopMetadata);
      expect(metadata.bottomMetadata).toEqual(defaultBottomMetadata);
    });
  });
});

describe('getSimulatedMetadata', () => {
  it('should return default metadata when no ownedBy data is present ', () => {
    const metadata = getSimulatedMetadata(mockBaseResponse as JsonLd.Response);
    expect(metadata.titleMetadata).toEqual([
      { name: ElementName.AuthorGroup },
      { name: ElementName.Priority },
      { name: ElementName.State },
    ]);
    expect(metadata.topMetadata).toEqual([
      { name: ElementName.ModifiedBy },
      { name: ElementName.ModifiedOn },
      { name: ElementName.AttachmentCount },
      { name: ElementName.CommentCount },
      { name: ElementName.ReactCount },
      { name: ElementName.SubscriberCount },
      { name: ElementName.ViewCount },
      { name: ElementName.VoteCount },
      { name: ElementName.ChecklistProgress },
      { name: ElementName.DueOn },
    ]);
    expect(metadata.bottomMetadata).toBeUndefined();
  });

  it('should return default metadata with ownedBy element if owned by data is present ', () => {
    const metadata = getSimulatedMetadata(
      mockConfluenceResponseWithOwnedBy as JsonLd.Response,
    );
    expect(metadata.titleMetadata).toEqual([
      { name: ElementName.AuthorGroup },
      { name: ElementName.Priority },
      { name: ElementName.State },
    ]);
    expect(metadata.topMetadata).toEqual([
      { name: ElementName.OwnedBy },
      { name: ElementName.ModifiedOn },
      { name: ElementName.AttachmentCount },
      { name: ElementName.CommentCount },
      { name: ElementName.ReactCount },
      { name: ElementName.SubscriberCount },
      { name: ElementName.ViewCount },
      { name: ElementName.VoteCount },
      { name: ElementName.ChecklistProgress },
      { name: ElementName.DueOn },
    ]);
    expect(metadata.bottomMetadata).toBeUndefined();
  });
});
