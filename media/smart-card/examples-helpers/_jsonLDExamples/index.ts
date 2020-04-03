export {
  BitbucketRepository,
  GithubRepository,
} from './atlassian.sourceCodeRepository';
export {
  BitbucketPullRequest,
  GithubPullRequest,
} from './atlassian.sourceCodePullRequest';
export {
  BitbucketSourceCodeReference,
  GithubSourceCodeReference,
} from './atlassian.sourceCodeReference';
export { BitbucketFile, GithubFile } from './atlassian.digitalDocument';

export { AsanaTask, GitHubIssue } from './atlassian.task';

// All Confluence mocks - mapped to different objects in
// the Atlassian Vocabulary.
export { ConfluencePage } from './atlassian.textDigitalDocument';
export { ConfluenceSpace } from './atlassian.project';
export { ConfluenceTemplate } from './atlassian.template';
export { ConfluenceBlogPost } from './schema.blogpost';
