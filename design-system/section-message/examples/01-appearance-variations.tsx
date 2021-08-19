/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/core';

import SectionMessage, { SectionMessageAction } from '../src';

const spacingStyles = css({
  padding: '8px',
});

const Example = () => (
  <div id="appearance-example">
    <div css={spacingStyles}>
      <SectionMessage appearance="information" title="More">
        <p>I count the steps from one end of my island to the other</p>
        <p>It{"'"}s a hundred steps from where I sleep to the sea</p>
      </SectionMessage>
    </div>
    <div css={spacingStyles}>
      <SectionMessage
        appearance="warning"
        actions={
          <SectionMessageAction href="https://www.youtube.com/watch?v=upjbIJESEUU">
            Outtake
          </SectionMessageAction>
        }
      >
        <p>And when I say I{"'"}ve learned all there is to know</p>
        <p>Well there{"'"}s another little island lesson</p>
        <p>Gramma Tala shows me</p>
      </SectionMessage>
    </div>
    <div css={spacingStyles}>
      <SectionMessage
        appearance="error"
        actions={
          <React.Fragment>
            <SectionMessageAction onClick={() => {}}>
              Outtake
            </SectionMessageAction>
            <SectionMessageAction>Moana</SectionMessageAction>
          </React.Fragment>
        }
      >
        <p>I know where I am from the scent of the breeze</p>
        <p>The ascent of the climb</p>
        <p>From the tangle of the trees</p>
      </SectionMessage>
    </div>
    <div css={spacingStyles}>
      <SectionMessage appearance="success">
        <p>From the angle of the mountain</p>
        <p>To the sand on our island shore</p>
        <p>I{"'"}ve been here before</p>
      </SectionMessage>
    </div>
    <div css={spacingStyles}>
      <SectionMessage appearance="discovery">
        <p>From the angle of the mountain</p>
        <p>To the sand on our island shore</p>
        <p>I{"'"}ve been here before</p>
      </SectionMessage>
    </div>
  </div>
);

export default Example;
