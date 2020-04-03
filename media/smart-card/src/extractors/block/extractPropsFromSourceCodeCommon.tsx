import { BlockCardResolvedViewProps } from '@atlaskit/media-ui';

export const isRepositoryResource = (json: any): boolean => {
  return (
    json &&
    json.context &&
    json.context['@type'] === 'atlassian:SourceCodeRepository'
  );
};

// Builds the name for Pull Requests, Branches and Commits.
export const buildName = (
  props: BlockCardResolvedViewProps,
  json: any,
): BlockCardResolvedViewProps => {
  const nextProps = { ...props };
  const link = nextProps.link || json.url;

  // Check if this is a reference to something _inside_ a Repository.
  if (link && isRepositoryResource(json)) {
    const repositoryName = (json.context && json.context.name) || '';

    // COMMIT: `repo-name: abf137c title of commit message`
    if (json['@type'] === 'atlassian:SourceCodeCommit') {
      const [, /* hashType */ hashContent] = (json['@id'] || '').split(':');
      const hash = (hashContent && `${hashContent.substring(0, 8)} `) || '';
      const repoName = repositoryName ? `${repositoryName}: ` : '';
      return { ...nextProps, title: `${repoName}${hash}${nextProps.title}` };
    }

    // PR: `repo-name: #42 title of pull request`
    if (json['@type'] === 'atlassian:SourceCodePullRequest') {
      const internalId =
        (json['atlassian:internalId'] && `#${json['atlassian:internalId']} `) ||
        '';
      const repoName = repositoryName ? `${repositoryName}: ` : '';
      return {
        ...nextProps,
        title: `${repoName}${internalId}${nextProps.title}`,
      };
    }

    // BRANCH: `repo-name/branch-name`
    if (json['@type'] === 'atlassian:SourceCodeReference') {
      const repoName = repositoryName ? `${repositoryName}/` : '';
      return { ...nextProps, title: `${repoName}${nextProps.title}` };
    }
  }

  return nextProps;
};
