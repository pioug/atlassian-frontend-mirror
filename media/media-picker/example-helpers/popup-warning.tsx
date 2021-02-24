import React from 'react';
import SectionMessage from '@atlaskit/section-message';

export default (
  <SectionMessage title="Popup is being deprecated" appearance="warning">
    <p>
      Popup component is currently on its way out. If you intend to use it,
      don't. If you're currently using it and you're not Cloud Confluence, Jira
      or Bitbucket, please visit{' '}
      <a href="https://atlassian.slack.com/archives/C01J9PM7XL1">
        #proj-unshipping-mediapicker
      </a>
      , we'll help you figure out deprecation strategy.
    </p>
  </SectionMessage>
);
