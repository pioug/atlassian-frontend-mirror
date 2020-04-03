import { extractInlineViewPropsFromSourceCodeRepository } from '../../extractPropsFromSourceCodeRepository';

describe('extractInlineViewPropsFromSourceCodeRepository', () => {
  it('should extract the repository name', () => {
    const props = extractInlineViewPropsFromSourceCodeRepository({
      url: 'https://bitbucket.org/atlassian/my-repostory',
      name: 'atlassian/my-repository',
    });
    expect(props).toHaveProperty('title', 'atlassian/my-repository');
  });
});
