import { JsonLd } from 'json-ld-types';
import { mount } from 'enzyme';

import { extractByline } from '../extractByline';
import { TEST_BASE_DATA, TEST_PERSON } from '../../__mocks__/jsonld';
import { render } from '../../__mocks__/render';

describe('extractors.byline', () => {
  it('returns undefined if neither created or updated present', () => {
    expect(extractByline(TEST_BASE_DATA)).toBe(undefined);
  });

  it('returns created at text if created present', () => {
    const byline = extractByline({
      ...TEST_BASE_DATA,
      'schema:dateCreated': new Date().toISOString(),
    } as JsonLd.Data.BaseData);
    expect(byline).toBeDefined();
    expect(mount(render(byline)).text()).toMatch(/Created.*/);
  });

  it('returns created at text and createdBy if present', () => {
    const byline = extractByline({
      ...TEST_BASE_DATA,
      'schema:dateCreated': new Date().toISOString(),
      attributedTo: TEST_PERSON,
    } as JsonLd.Data.BaseData);
    expect(byline).toBeDefined();
    expect(mount(render(byline)).text()).toMatch(/Created.*by.*my name/);
  });

  it('returns updated at text if created present', () => {
    const byline = extractByline({
      ...TEST_BASE_DATA,
      updated: new Date().toISOString(),
    } as JsonLd.Data.BaseData);
    expect(byline).toBeDefined();
    expect(mount(render(byline)).text()).toMatch(/Updated.*/);
  });

  it('returns updated at text and updatedBy if present', () => {
    const byline = extractByline({
      ...TEST_BASE_DATA,
      updated: new Date().toISOString(),
      'atlassian:updatedBy': TEST_PERSON,
    } as JsonLd.Data.BaseData);
    expect(byline).toBeDefined();
    expect(mount(render(byline)).text()).toMatch(/Updated.*by.*my name/);
  });
});
