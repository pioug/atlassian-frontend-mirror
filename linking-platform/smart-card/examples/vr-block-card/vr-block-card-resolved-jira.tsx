import React from 'react';

import { type JsonLd } from '@atlaskit/json-ld-types';
import { CardClient as Client } from '@atlaskit/link-provider';
import { JiraIssue, JiraIssueAssigned, JiraProject } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

const examples = {
	[JiraIssue.data.url]: JiraIssue,
	[JiraIssueAssigned.data.url]: JiraIssueAssigned,
	[JiraProject.data.url]: JiraProject,
};
class CustomClient extends Client {
	fetchData(url: string) {
		let response = { ...examples[url as keyof typeof examples] };
		return Promise.resolve(response as JsonLd.Response);
	}
}

export const BlockCardJira = (): React.JSX.Element => (
	<div>
		<h4>Jira Unassigned Issue</h4>
		<VRCardView appearance="block" client={new CustomClient()} url={JiraIssue.data.url} />
		<h4>Jira Assigned To issue</h4>
		<VRCardView appearance="block" client={new CustomClient()} url={JiraIssueAssigned.data.url} />
		<h4>Jira Project</h4>
		<VRCardView appearance="block" client={new CustomClient()} url={JiraProject.data.url} />
	</div>
);
