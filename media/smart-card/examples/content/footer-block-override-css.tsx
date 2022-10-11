/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { FooterBlock } from '../../src';
import ExampleContainer from './example-container';

const styles = css`
  background-color: ${token(
    'color.background.accent.blue.subtlest',
    '#E9F2FF',
  )};
  border-radius: 24px;
  padding: 8px;
`;

export default () => (
  <ExampleContainer>
    <FooterBlock overrideCss={styles} />
  </ExampleContainer>
);
