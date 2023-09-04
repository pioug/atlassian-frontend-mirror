import React from 'react';
import { JsonLd } from 'json-ld-types';
import { Client } from '@atlaskit/smart-card';
import VRCardView from '../utils/vr-card-view';
import {
  JiraIssue,
  JiraIssueAssigned,
} from '../../examples-helpers/_jsonLDExamples';

const examples = {
  [JiraIssue.data.url]: JiraIssue,
  [JiraIssueAssigned.data.url]: JiraIssueAssigned,
};
class CustomClient extends Client {
  fetchData(url: string) {
    let response = { ...examples[url as keyof typeof examples] };
    return Promise.resolve(response as JsonLd.Response);
  }
}

export default () => (
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
  </div>
);
