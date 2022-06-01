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
              href="#hiAtlassianBitbucket"
              testId="bitbucket"
            >
              Bitbucket
            </SectionMessageAction>
            <SectionMessageAction href="#hiAtlassianJira" testId="jira">
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
    <div css={spacingStyles}>
      <SectionMessage
        title="this/is/a/really/long/path/to/a/file/to/test/if/the/section/message/component/will/correctly/wrap/words/onto/new/lines/to/prevent/the/text/overflowing/the/component/which/causes/display/issues"
        testId="overflow-section-message"
      >
        <p>
          this/is/a/really/long/path/to/a/file/to/test/if/the/section/message/component/will/correctly/wrap/words/onto/new/lines/to/prevent/the/text/overflowing/the/component/which/causes/display/issues
        </p>
      </SectionMessage>
    </div>
    <div css={spacingStyles}>
      <SectionMessage
        title="Testing actions overflow"
        testId="overflow-actions-section-message"
        actions={
          <React.Fragment>
            <SectionMessageAction href="#1">Action 1</SectionMessageAction>
            <SectionMessageAction href="#2">Action 2</SectionMessageAction>
            <SectionMessageAction href="#3">Action 3</SectionMessageAction>
            <SectionMessageAction href="#4">Action 4</SectionMessageAction>
            <SectionMessageAction href="#5">Action 5</SectionMessageAction>
            <SectionMessageAction href="#6">Action 6</SectionMessageAction>
            <SectionMessageAction href="#7">Action 7</SectionMessageAction>
            <SectionMessageAction href="#8">Action 8</SectionMessageAction>
            <SectionMessageAction href="#9">Action 9</SectionMessageAction>
            <SectionMessageAction href="#10">Action 10</SectionMessageAction>
            <SectionMessageAction href="#11">Action 11</SectionMessageAction>
            <SectionMessageAction href="#12">Action 12</SectionMessageAction>
            <SectionMessageAction href="#13">Action 13</SectionMessageAction>
            <SectionMessageAction href="#14">Action 14</SectionMessageAction>
            <SectionMessageAction href="#15">Action 15</SectionMessageAction>
            <SectionMessageAction href="#16">Action 16</SectionMessageAction>
            <SectionMessageAction href="#17">Action 17</SectionMessageAction>
            <SectionMessageAction href="#18">Action 18</SectionMessageAction>
            <SectionMessageAction href="#19">Action 19</SectionMessageAction>
            <SectionMessageAction href="#20">Action 20</SectionMessageAction>
          </React.Fragment>
        }
      >
        <p>
          This Section Message has lots of actions. This is a test to ensure
          they don't overflow
        </p>
      </SectionMessage>
    </div>
  </React.Fragment>
);

export default Example;
