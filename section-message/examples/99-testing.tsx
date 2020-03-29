import React, { Fragment } from 'react';
import styled from 'styled-components';
import SectionMessage from '../src';

const Padding = styled.div`
  padding: 8px;
`;

const Example = () => (
  <Fragment>
    <Padding>
      <SectionMessage
        appearance="info"
        title="Atlassian"
        testId="info-section-message"
        actions={[
          {
            key: 'bitbucket',
            href: 'https://www.atlassian.com/software/bitbucket',
            text: 'Bitbucket',
            testId: 'bitbucket',
          },
          {
            key: 'jira',
            href: 'https://www.atlassian.com/software/jira',
            text: 'Jira',
            testId: 'jira',
          },
        ]}
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
    </Padding>
    <Padding>
      <SectionMessage
        appearance="error"
        testId="error-section-message"
        actions={[
          {
            key: 'google',
            href: 'https://about.google/',
            text: 'Google',
            testId: 'google',
          },
        ]}
      >
        <p />
        <b>Google:</b>
        <p>
          Our mission is to organise the world’s information and make it
          universally accessible and useful.
        </p>
      </SectionMessage>
    </Padding>
  </Fragment>
);

export default Example;
