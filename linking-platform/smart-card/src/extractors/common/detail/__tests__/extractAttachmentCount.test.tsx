import React from 'react';
import { mount } from 'enzyme';

import {
  extractAttachmentCount,
  LinkAttachmentType,
} from '../extractAttachmentCount';
import { TEST_BASE_DATA } from '../../__mocks__/jsonld';

const BASE_DATA = TEST_BASE_DATA as LinkAttachmentType;

describe('extractors.detail.AttachmentCount', () => {
  it('returns undefined when no attachment count present', () => {
    expect(extractAttachmentCount(BASE_DATA)).toBe(undefined);
  });

  it('returns number and icon when attachment count present', () => {
    const detail = extractAttachmentCount({
      ...BASE_DATA,
      'atlassian:attachmentCount': 12,
    });
    expect(detail).toBeDefined();
    expect(detail!.text).toBe('12');
    expect(mount(<>{detail!.icon}</>).find('AttachmentIcon')).toHaveLength(1);
  });
});
