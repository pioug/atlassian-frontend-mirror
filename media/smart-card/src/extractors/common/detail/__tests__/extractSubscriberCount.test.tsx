import React from 'react';
import { mount } from 'enzyme';

import {
  extractSubscriberCount,
  LinkSubscriberType,
} from '../extractSubscriberCount';
import { TEST_BASE_DATA } from '../../__mocks__/jsonld';

const BASE_DATA = TEST_BASE_DATA as LinkSubscriberType;

describe('extractors.detail.SubscriberCount', () => {
  it('returns undefined when no subscriber count present', () => {
    expect(extractSubscriberCount(BASE_DATA)).toBe(undefined);
  });

  it('returns number and icon when subscriber count present', () => {
    const detail = extractSubscriberCount({
      ...BASE_DATA,
      'atlassian:subscriberCount': 40,
    });
    expect(detail).toBeDefined();
    expect(detail!.text).toBe('40');
    expect(mount(<>{detail!.icon}</>).find('PeopleIcon')).toHaveLength(1);
  });
});
