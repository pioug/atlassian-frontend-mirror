/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/** @jsx jsx */
import { Status, Color } from '../src/element';
import { css, jsx } from '@emotion/react';

const containerStyles = css`
  width: 140px;
`;

const StatusInParagraph = ({ text, color }: { text: string; color: Color }) => (
  <p>
    <Status text={text} color={color} />
  </p>
);

export default () => (
  <div css={containerStyles} id="container">
    <StatusInParagraph text="Unavailable" color="neutral" />
    <StatusInParagraph text="New" color="purple" />
    <StatusInParagraph text="In progress" color="blue" />
    <StatusInParagraph text="Blocked" color="red" />
    <StatusInParagraph text="On hold" color="yellow" />
    <StatusInParagraph text="Done" color="green" />
  </div>
);
