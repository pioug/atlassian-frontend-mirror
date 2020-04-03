import { extractInlineViewPropsFromTemplate } from '../../extractPropsFromTemplate';

describe('extractInlineViewPropsFromTemplate', () => {
  it('should return no icon when a generator is not specified', () => {
    expect(extractInlineViewPropsFromTemplate({})).toEqual({ title: '' });
  });

  it('should return an icon when an appropriate generator is provided', () => {
    const props = extractInlineViewPropsFromTemplate({
      generator: { '@id': 'https://www.atlassian.com/#Confluence' },
    });
    expect(props).toHaveProperty('icon');
  });
});
