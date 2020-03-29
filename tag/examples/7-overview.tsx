import React from 'react';
import Avatar from '@atlaskit/avatar';
import Tag from '../src';

export default () => (
  <div>
    <Tag text="Text only" />
    <Tag href="https://some.link" text="Linked text" />
    <Tag text="Removable" removeButtonText="Remove me" />
    <Tag
      href="https://some.link"
      text="Removable & linked"
      removeButtonText="Remove me"
    />
    <Tag text="Overflowing text that will be cut off" />
    <Tag
      text="Text with button that will be cut off"
      removeButtonText="Remove me"
    />
    <Tag
      appearance="rounded"
      text="A. Cool Name"
      elemBefore={<Avatar size="xsmall" />}
      removeButtonText="Remove me"
    />
    <Tag
      appearance="rounded"
      href="https://some.link"
      text="A. Cool Name"
      elemBefore={<Avatar size="xsmall" />}
      removeButtonText="Remove me"
    />
    <Tag text="standard color" color="standard" />
    <Tag text="green color" color="green" />
    <Tag text="teal color" color="teal" />
    <Tag text="blue color" color="blue" />
    <Tag text="purple color" color="purple" />
    <Tag text="red color" color="red" />
    <Tag text="yellow color" color="yellow" />
    <Tag text="grey color" color="grey" />
    <Tag text="greenLight color" color="greenLight" />
    <Tag text="tealLight color" color="tealLight" />
    <Tag text="blueLight color" color="blueLight" />
    <Tag text="purpleLight color" color="purpleLight" />
    <Tag text="redLight color" color="redLight" />
    <Tag text="yellowLight color" color="yellowLight" />
    <Tag text="greyLight color" color="greyLight" />

    <Tag text="red color" color="red" href="https://atlaskit.atlassian.com/" />
    <Tag
      text="yellow color"
      color="yellow"
      href="https://atlaskit.atlassian.com/"
    />
    <Tag
      text="grey color"
      color="grey"
      href="https://atlaskit.atlassian.com/"
    />
    <Tag
      text="greenLight color"
      color="greenLight"
      href="https://atlaskit.atlassian.com/"
    />
    <Tag
      text="tealLight color"
      color="tealLight"
      href="https://atlaskit.atlassian.com/"
    />
    <Tag
      text="blueLight color"
      color="blueLight"
      href="https://atlaskit.atlassian.com/"
    />
  </div>
);
