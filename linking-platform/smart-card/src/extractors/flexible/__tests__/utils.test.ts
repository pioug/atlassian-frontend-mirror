import { JsonLd } from 'json-ld-types';

import {
  TEST_BASE_DATA,
  TEST_LINK,
  TEST_NAME,
  TEST_PERSON,
  TEST_PULL_REQUEST,
  TEST_URL,
} from '../../common/__mocks__/jsonld';
import {
  extractAttachmentCount,
  extractChecklistProgress,
  extractCommentCount,
  extractCreatedBy,
  extractDueOn,
  extractModifiedBy,
  extractProgrammingLanguage,
  extractSourceBranch,
  extractSubscriberCount,
  extractTargetBranch,
} from '../utils';

describe('extractAttachmentCount', () => {
  it('returns undefined when no attachment count present', () => {
    expect(extractAttachmentCount(TEST_BASE_DATA)).toBe(undefined);
  });

  it('returns number and icon when attachment count present', () => {
    const value = extractAttachmentCount({
      ...TEST_BASE_DATA,
      'atlassian:attachmentCount': 3,
    } as JsonLd.Data.BaseData);
    expect(value).toBeDefined();
    expect(value).toBe(3);
  });
});

describe('extractChecklistProgress', () => {
  it('returns undefined when no atlassian:checkItems present', () => {
    expect(extractChecklistProgress(TEST_BASE_DATA)).toBe(undefined);
  });

  it('returns progress when atlassian:checkItems present', () => {
    const value = extractChecklistProgress({
      ...TEST_BASE_DATA,
      'atlassian:checkItems': {
        checkedItems: '2',
        totalItems: '7',
      },
    } as JsonLd.Data.BaseData);
    expect(value).toBeDefined();
    expect(value).toBe('2/7');
  });
});

describe('extractCommentCount', () => {
  it('returns undefined when no comment count present', () => {
    expect(extractCommentCount(TEST_BASE_DATA)).toBe(undefined);
  });

  it('returns number and icon when comment count present', () => {
    const value = extractCommentCount({
      ...TEST_BASE_DATA,
      'schema:commentCount': 40,
    } as JsonLd.Data.BaseData);

    expect(value).toBeDefined();
    expect(value).toBe(40);
  });
});

describe('extractCreatedBy', () => {
  it('returns undefined when there is no data on who created the resource', () => {
    expect(extractCreatedBy(TEST_BASE_DATA)).toBeUndefined();
  });

  it('returns name of the person/entity that created the resource', () => {
    const value = extractCreatedBy({
      ...TEST_BASE_DATA,
      attributedTo: TEST_PERSON,
    });
    expect(value).toEqual(TEST_NAME);
  });
});

describe('extractDueOn', () => {
  it('returns undefined when there is no data on resource due date', () => {
    expect(extractDueOn(TEST_BASE_DATA)).toBeUndefined();
  });

  it('returns resource due date', () => {
    const endTime = '2022-06-28T06:44:18.713591Z';
    const value = extractDueOn({
      ...TEST_BASE_DATA,
      endTime,
    });
    expect(value).toEqual(endTime);
  });
});

describe('extractProgrammingLanguage', () => {
  it('returns undefined when no programming language present', () => {
    expect(extractProgrammingLanguage(TEST_BASE_DATA)).toBe(undefined);
  });

  it('returns number and icon when programming language present', () => {
    const value = extractProgrammingLanguage({
      ...TEST_BASE_DATA,
      'schema:programmingLanguage': 'JavaScript',
    } as JsonLd.Data.BaseData);
    expect(value).toBeDefined();
    expect(value).toBe('JavaScript');
  });
});

describe('extractors.detail.SubscriberCount', () => {
  it('returns undefined when no subscriber count present', () => {
    expect(extractSubscriberCount(TEST_BASE_DATA)).toBe(undefined);
  });

  it('returns number and icon when subscriber count present', () => {
    const value = extractSubscriberCount({
      ...TEST_BASE_DATA,
      'atlassian:subscriberCount': 40,
    } as JsonLd.Data.BaseData);
    expect(value).toBeDefined();
    expect(value).toBe(40);
  });
});

describe('extractModifiedBy', () => {
  it('returns undefined when there is no data on who updated the resource', () => {
    expect(extractModifiedBy(TEST_BASE_DATA)).toBeUndefined();
  });

  it('returns name of the person/entity that updated the resource', () => {
    const value = extractModifiedBy({
      ...TEST_BASE_DATA,
      'atlassian:updatedBy': TEST_PERSON,
    } as JsonLd.Data.BaseData);
    expect(value).toEqual(TEST_NAME);
  });
});

describe('extractSourceBranch', () => {
  it('returns undefined when link has no source branch', () => {
    expect(
      extractSourceBranch(TEST_BASE_DATA as JsonLd.Data.SourceCodePullRequest),
    ).toBeUndefined();
  });

  it('returns undefined when pull request has no source branch', () => {
    expect(extractSourceBranch(TEST_PULL_REQUEST)).toBeUndefined();
  });

  it('returns undefined when pull request has no source branch name (string)', () => {
    expect(
      extractSourceBranch({
        ...TEST_PULL_REQUEST,
        'atlassian:mergeSource': TEST_URL,
      }),
    ).toBeUndefined();
  });

  it('returns undefined when pull request has no source branch name (object)', () => {
    expect(
      extractSourceBranch({
        ...TEST_PULL_REQUEST,
        'atlassian:mergeSource': { '@type': 'Link', href: TEST_URL },
      }),
    ).toBeUndefined();
  });

  it('returns name of the pull request source branch', () => {
    expect(
      extractSourceBranch({
        ...TEST_PULL_REQUEST,
        'atlassian:mergeSource': TEST_LINK,
      }),
    ).toEqual(TEST_NAME);
  });
});

describe('extractTargetBranch', () => {
  it('returns undefined when link has no source branch', () => {
    expect(
      extractTargetBranch(TEST_BASE_DATA as JsonLd.Data.SourceCodePullRequest),
    ).toBeUndefined();
  });

  it('returns undefined when pull request has no source branch', () => {
    expect(extractTargetBranch(TEST_PULL_REQUEST)).toBeUndefined();
  });

  it('returns undefined when pull request has no source branch name (string)', () => {
    expect(
      extractTargetBranch({
        ...TEST_PULL_REQUEST,
        'atlassian:mergeDestination': TEST_URL,
      }),
    ).toBeUndefined();
  });

  it('returns undefined when pull request has no source branch name (object)', () => {
    expect(
      extractTargetBranch({
        ...TEST_PULL_REQUEST,
        'atlassian:mergeDestination': { '@type': 'Link', href: TEST_URL },
      }),
    ).toBeUndefined();
  });

  it('returns name of the pull request source branch', () => {
    expect(
      extractTargetBranch({
        ...TEST_PULL_REQUEST,
        'atlassian:mergeDestination': TEST_LINK,
      }),
    ).toEqual(TEST_NAME);
  });
});
