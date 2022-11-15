import { extractIcon } from '../extractIcon';
import { TEST_BASE_DATA, TEST_URL, TEST_OBJECT } from '../../__mocks__/jsonld';
import { mount } from 'enzyme';
import { render } from '../../__mocks__/render';
import { JsonLd } from 'json-ld-types';

describe('extractors.icon', () => {
  it('returns highest priority icon from array of types', () => {
    const icon = extractIcon({
      ...TEST_BASE_DATA,
      '@type': ['Document', 'schema:BlogPosting'],
    });
    expect(mount(render(icon)).find('Blog16Icon')).toHaveLength(1);
  });

  it('returns highest priority icon based on icon priority flag', () => {
    const icon = extractIcon(
      {
        ...TEST_BASE_DATA,
        '@type': ['Document', 'schema:BlogPosting'],
        generator: TEST_OBJECT,
      },
      'provider',
    );
    expect(icon).toBe(TEST_URL);
  });

  it('returns icon for singular type', () => {
    const icon = extractIcon({
      ...TEST_BASE_DATA,
      '@type': 'schema:BlogPosting',
    });
    expect(mount(render(icon)).find('Blog16Icon')).toHaveLength(1);
  });

  it('returns icon for Project - with top level icon', () => {
    const icon = extractIcon({
      ...TEST_BASE_DATA,
      '@type': 'atlassian:Project',
    });
    expect(icon).toBe(TEST_URL);
  });

  it('returns icon for Project - no top level icon', () => {
    const icon = extractIcon({
      ...TEST_BASE_DATA,
      icon: undefined,
      '@type': 'atlassian:Project',
    });
    expect(mount(render(icon)).find('PeopleGroupIcon')).toHaveLength(1);
  });

  it('returns icon for SourceCodeCommit', () => {
    const icon = extractIcon({
      ...TEST_BASE_DATA,
      '@type': 'atlassian:SourceCodeCommit',
    });
    expect(mount(render(icon)).find('Commit16Icon')).toHaveLength(1);
  });

  it('returns icon for SourceCodePullRequest', () => {
    const icon = extractIcon({
      ...TEST_BASE_DATA,
      '@type': 'atlassian:SourceCodePullRequest',
    });
    expect(mount(render(icon)).find('PullRequest16Icon')).toHaveLength(1);
  });

  it('returns icon for SourceCodeReference', () => {
    const icon = extractIcon({
      ...TEST_BASE_DATA,
      '@type': 'atlassian:SourceCodeReference',
    });
    expect(mount(render(icon)).find('Branch16Icon')).toHaveLength(1);
  });

  it('returns icon for SourceCodeRepository', () => {
    const icon = extractIcon({
      ...TEST_BASE_DATA,
      '@type': 'atlassian:SourceCodeRepository',
    });
    expect(mount(render(icon)).find('Code16Icon')).toHaveLength(1);
  });

  it('returns icon for Document - using file format', () => {
    const icon = extractIcon({
      ...TEST_BASE_DATA,
      '@type': 'Document',
      'schema:fileFormat': 'image/png',
    } as JsonLd.Data.Document);
    expect(mount(render(icon))).toBeDefined();
  });

  it('returns icon for Document - using provider icon', () => {
    const icon = extractIcon({
      ...TEST_BASE_DATA,
      '@type': 'Document',
      generator: {
        '@type': 'Object',
        name: 'DocumentGenerator',
        icon: TEST_URL,
      },
    } as JsonLd.Data.Document);
    expect(icon).toBe(TEST_URL);
  });

  it('returns icon for Task - using default', () => {
    const icon = extractIcon({
      ...TEST_BASE_DATA,
      '@type': 'atlassian:Task',
    } as JsonLd.Data.Task);
    expect(mount(render(icon)).find('Task16Icon')).toHaveLength(1);
  });
});
