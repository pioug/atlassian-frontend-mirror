import React from 'react';
import { mount } from 'enzyme';

import { extractCommentCount, LinkCommentType } from '../extractCommentCount';
import { TEST_BASE_DATA } from '../../__mocks__/jsonld';

const BASE_DATA = TEST_BASE_DATA as LinkCommentType;

describe('extractors.detail.commentCount', () => {
  it('returns undefined when no comment count present', () => {
    expect(extractCommentCount(BASE_DATA)).toBe(undefined);
  });

  it('returns number and icon when comment count present', () => {
    const detail = extractCommentCount({
      ...BASE_DATA,
      'schema:commentCount': 40,
    });
    expect(detail).toBeDefined();
    expect(detail!.text).toBe('40');
    expect(mount(<>{detail!.icon}</>).find('CommentIcon')).toHaveLength(1);
  });
});
