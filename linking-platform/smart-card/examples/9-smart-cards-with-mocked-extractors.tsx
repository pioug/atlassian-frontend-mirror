import React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { Card, Client, Provider, type ResolveResponse } from '../src';
import {
	GithubRepository,
	BitbucketRepository2,
	ConfluencePage,
	ConfluenceBlogPost,
	ConfluenceSpace,
	ConfluenceTemplate,
	BitbucketPullRequest2,
	BitbucketSourceCodeReference,
	BitbucketFile2,
	GithubPullRequest,
	GithubSourceCodeReference,
	GithubFile,
	JiraTasks,
	GitHubIssue,
} from '../examples-helpers/_jsonLDExamples';
import { IntlProvider } from 'react-intl-next';
import { type EnvironmentsKeys } from '@atlaskit/link-provider';

class BitbucketClient extends Client {
	constructor(config: EnvironmentsKeys) {
		super(config);
	}
	fetchData(): Promise<ResolveResponse> {
		return Promise.resolve(BitbucketRepository2 as ResolveResponse);
	}
}

class GithubClient extends Client {
	constructor(config: EnvironmentsKeys) {
		super(config);
	}
	fetchData(): Promise<ResolveResponse> {
		return Promise.resolve(GithubRepository as ResolveResponse);
	}
}

const bitbucketClient = new BitbucketClient('staging');
const githubClient = new GithubClient('staging');

class Example extends React.Component {
	render() {
		return (
			<IntlProvider locale="en">
				<Page>
					<Grid>
						<GridColumn>
							<h3>Source Repository Examples (block)</h3>
							<br />
							<div>
								<Provider client={bitbucketClient}>
									<Card url="https://bitbucket.org/tuser/test-repo" appearance="block" />
								</Provider>
							</div>
							<br />
							<div>
								<Provider client={githubClient}>
									<Card url="https://github.com/User/repo-name" appearance="block" />
								</Provider>
							</div>
						</GridColumn>
						<GridColumn>
							<br />
							<h3>Confluence Examples (inline)</h3>
							<br />
							<div>
								Hey maybe you were after the info on:
								<Card
									url="https://confluence.atlassian.com/some/page"
									appearance="inline"
									data={ConfluencePage}
								/>
							</div>
							<div>
								Or was it...
								<Card
									url="https://confluence.atlassian.com/some/blog"
									appearance="inline"
									data={ConfluenceBlogPost}
								/>
							</div>
							<div>
								I've added all the info you were after on
								<Card
									url="https://confluence.atlassian.com/some/space"
									appearance="inline"
									data={ConfluenceSpace}
								/>
							</div>
							<div>
								The template you're after is probably
								<Card
									url="https://confluence.atlassian.com/some/template"
									appearance="inline"
									data={ConfluenceTemplate}
								/>
							</div>
							<h3>Jira Examples (inline)</h3>
							<br />
							{JiraTasks.map((task, i) => (
								<div>
									Maybe checkout the {task['atlassian:taskType'].name} at{' '}
									<Card
										key={String(i) + task['@id']}
										url={task.url}
										appearance="inline"
										data={task}
									/>
								</div>
							))}
							<h3>Bitbucket Examples (inline)</h3>
							<br />
							<div>
								The repository you're after is probably
								<Card
									url="https://bitbucket.org/some/repo"
									appearance="inline"
									data={BitbucketRepository2}
								/>
							</div>
							<div>
								The pull request you're after is probably
								<Card
									url="https://bitbucket.org/some/pr"
									appearance="inline"
									data={BitbucketPullRequest2}
								/>
							</div>
							<div>
								The branch you're after is probably
								<Card
									url="https://bitbucket.org/some/branch"
									appearance="inline"
									data={BitbucketSourceCodeReference}
								/>
							</div>
							<div>
								The file you're after is probably
								<Card
									url="https://bitbucket.org/some/file"
									appearance="inline"
									data={BitbucketFile2}
								/>
							</div>
							<h3>Github Examples (inline)</h3>
							<br />
							<div>
								The repository you're after is probably
								<Card
									url="https://github.com/some/repo"
									appearance="inline"
									data={GithubRepository}
								/>
							</div>
							<div>
								The pull request you're after is probably
								<Card
									url="https://github.com/some/pr"
									appearance="inline"
									data={GithubPullRequest}
								/>
							</div>
							<div>
								The branch you're after is probably
								<Card
									url="https://github.com/some/branch"
									appearance="inline"
									data={GithubSourceCodeReference}
								/>
							</div>
							<div>
								The file you're after is probably
								<Card url="https://github.com/some/file" appearance="inline" data={GithubFile} />
							</div>
							<div>
								The issue you're after is probably
								<Card url="https://github.com/some/issue" appearance="inline" data={GitHubIssue} />
							</div>
						</GridColumn>
					</Grid>
				</Page>
			</IntlProvider>
		);
	}
}

export default () => <Example />;
