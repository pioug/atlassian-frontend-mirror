import { extractInlineViewPropsFromTextDocument } from '../../extractPropsFromTextDocument';

describe('extractInlineViewPropsFromTextDocument', () => {
  it('should return no icon when a generator is not specified', () => {
    expect(extractInlineViewPropsFromTextDocument({})).toEqual({ title: '' });
  });

  it('should return an icon when an appropriate generator is provided', () => {
    const props = extractInlineViewPropsFromTextDocument({
      generator: { '@id': 'https://www.atlassian.com/#Confluence' },
    });
    expect(props).toHaveProperty('icon');
  });
});
