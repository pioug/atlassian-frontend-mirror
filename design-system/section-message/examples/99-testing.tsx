/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/core';

import SectionMessage, { SectionMessageAction } from '../src';

const spacingStyles = css({
  padding: '8px',
});

const Example = () => (
  <React.Fragment>
    <div css={spacingStyles}>
      <SectionMessage
        appearance="information"
        title="Atlassian"
        testId="info-section-message"
        actions={
          <React.Fragment>
            <SectionMessageAction
              href="https://www.atlassian.com/software/bitbucket"
              testId="bitbucket"
            >
              Bitbucket
            </SectionMessageAction>
            <SectionMessageAction
              href="https://www.atlassian.com/software/jira"
              testId="jira"
            >
              Jira
            </SectionMessageAction>
          </React.Fragment>
        }
      >
        <p>
          Atlassian provides the tools to help every team unleash their full
          potential.
        </p>
        <p />
        <b>Bitbucket:</b>
        <p>
          Bitbucket is more than just Git code management. Bitbucket gives teams
          one place to plan projects, collaborate on code, test, and deploy.
        </p>
        <p />
        <b>Jira:</b>
        <p>The #1 software development tool used by agile teams.</p>
      </SectionMessage>
    </div>
    <div css={spacingStyles}>
      <SectionMessage
        appearance="error"
        testId="error-section-message"
        actions={
          <SectionMessageAction href="https://about.google/" testId="google">
            Google
          </SectionMessageAction>
        }
      >
        <p />
        <b>Google:</b>
        <p>
          Our mission is to organise the world’s information and make it
          universally accessible and useful.
        </p>
      </SectionMessage>
    </div>
  </React.Fragment>
);

export default Example;
