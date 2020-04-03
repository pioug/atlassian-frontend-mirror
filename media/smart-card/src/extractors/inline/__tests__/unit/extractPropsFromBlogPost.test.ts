import { extractInlineViewPropsFromBlogPost } from '../../extractPropsFromBlogPost';

describe('extractInlineViewPropsFromBlogPost', () => {
  it('should return no icon when a generator is not specified', () => {
    expect(extractInlineViewPropsFromBlogPost({})).toEqual({ title: '' });
  });

  it('should return an icon when an appropriate generator is provided', () => {
    const props = extractInlineViewPropsFromBlogPost({
      generator: { '@id': 'https://www.atlassian.com/#Confluence' },
    });
    expect(props).toHaveProperty('icon');
  });
});
