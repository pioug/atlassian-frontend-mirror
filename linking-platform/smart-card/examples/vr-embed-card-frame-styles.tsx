import React from 'react';
import { VRTestWrapper } from './utils/vr-test';
import { ExpandedFrame } from '../src/view/EmbedCard/components/ExpandedFrame';

export default () => (
  <VRTestWrapper title="Embed card frame styles">
    <h2>Frame Style: "hide" & isSelected = 'false'</h2>
    <ExpandedFrame
      text="frame text"
      href="https://www.google.com"
      testId="embed-frame-hide"
      frameStyle="hide"
    />
    <h2>Frame Style: "hide" & isSelected = 'true'</h2>
    <ExpandedFrame
      text="frame text"
      href="https://www.google.com"
      testId="embed-frame-hide-selected"
      frameStyle="hide"
      isSelected={true}
    />
    <h2> Frame Style: "show" & isSelected = 'false' </h2>
    <ExpandedFrame
      text="frame text"
      href="https://www.google.com"
      testId="embed-frame-show"
      frameStyle="show"
    />
    <h2> Frame Style: "show" & isSelected = 'true' </h2>
    <ExpandedFrame
      text="frame text"
      href="https://www.google.com"
      testId="embed-frame-show-selected"
      frameStyle="show"
      isSelected={true}
    />
    <h2> Frame Style: "showOnHover" when a mouse isn't hovering the embed </h2>
    <ExpandedFrame
      text="frame text"
      href="https://www.google.com"
      testId="embed-frame-show-on-hover"
      frameStyle="showOnHover"
    />
    <h2> Frame Style: "showOnHover" when a mouse is hovering the embed </h2>
    <ExpandedFrame
      text="frame text"
      href="https://www.google.com"
      testId="embed-frame-show-on-hover-mouse-over"
      frameStyle="showOnHover"
    />
    <h2> Frame Style: "showOnHover" & isSelected = 'true' </h2>
    <ExpandedFrame
      text="frame text"
      href="https://www.google.com"
      testId="embed-frame-show-on-hover-selected"
      frameStyle="showOnHover"
      isSelected={true}
    />
  </VRTestWrapper>
);
