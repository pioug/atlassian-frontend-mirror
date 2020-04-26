import React from 'react';
import { mount } from 'enzyme';

import {
  extractProgrammingLanguage,
  LinkProgrammingLanguageType,
} from '../extractProgrammingLanguage';
import { TEST_BASE_DATA } from '../../__mocks__/jsonld';

const BASE_DATA = TEST_BASE_DATA as LinkProgrammingLanguageType;

describe('extractors.detail.programmingLanguage', () => {
  it('returns undefined when no programming language present', () => {
    expect(extractProgrammingLanguage(BASE_DATA)).toBe(undefined);
  });

  it('returns number and icon when programming language present', () => {
    const detail = extractProgrammingLanguage({
      ...BASE_DATA,
      'schema:programmingLanguage': 'JavaScript',
    });
    expect(detail).toBeDefined();
    expect(detail!.text).toBe('JavaScript');
    expect(mount(<>{detail!.icon}</>).find('CodeIcon')).toHaveLength(1);
  });
});
