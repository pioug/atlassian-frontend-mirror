/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { PreviewBlock } from '../../src';
import ExampleContainer from './example-container';

const styles = css`
  [data-smart-element-media] {
    aspect-ratio: 4 / 3;

    // fallback
    @supports not (aspect-ratio: auto) {
      padding-top: 75%; // 4:3 ratio (3 / 4 = 0.75)
    }
  }
`;

export default () => (
  <ExampleContainer>
    <PreviewBlock overrideCss={styles} />
  </ExampleContainer>
);
