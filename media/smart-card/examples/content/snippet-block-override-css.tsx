/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { SnippetBlock } from '../../src';
import ExampleContainer from './example-container';

const styles = css`
  font-style: italic;
`;

export default () => (
  <ExampleContainer>
    <SnippetBlock overrideCss={styles} />
  </ExampleContainer>
);
