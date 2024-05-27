import React from 'react';
import { type JsonLd } from 'json-ld-types';
import { Client } from '@atlaskit/smart-card';
import VRCardView from '../utils/vr-card-view';
import {
  JiraIssue,
  JiraIssueAssigned,
  JiraProject,
} from '../../examples-helpers/_jsonLDExamples';

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

export const BlockCardJira = () => (
  <div>
    <h4>Jira Unassigned Issue</h4>
    <VRCardView
      appearance="block"
      client={new CustomClient()}
      url={JiraIssue.data.url}
    />
    <h4>Jira Assigned To issue</h4>
    <VRCardView
      appearance="block"
      client={new CustomClient()}
      url={JiraIssueAssigned.data.url}
    />
    <h4>Jira Project</h4>
    <VRCardView
      appearance="block"
      client={new CustomClient()}
      url={JiraProject.data.url}
    />
  </div>
);

export const BlockCardJiraLegacy = () => (
  <div>
    <h4>Jira Unassigned Issue</h4>
    <VRCardView
      appearance="block"
      client={new CustomClient()}
      url={JiraIssue.data.url}
      useLegacyBlockCard={true}
    />
    <h4>Jira Assigned To issue</h4>
    <VRCardView
      appearance="block"
      client={new CustomClient()}
      url={JiraIssueAssigned.data.url}
      useLegacyBlockCard={true}
    />
    <h4>Jira Project</h4>
    <VRCardView
      appearance="block"
      client={new CustomClient()}
      url={JiraProject.data.url}
      useLegacyBlockCard={true}
    />
  </div>
);
