/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { PreviewBlock } from '../../src';
import ExampleContainer from './example-container';

const styles = css({
  '[data-smart-element-media]': {
    aspectRatio: '4 / 3',
    '@supports not (aspect-ratio: auto)': {
      paddingTop: '75%',
    },
  },
});

export default () => (
  <ExampleContainer>
    <PreviewBlock overrideCss={styles} />
  </ExampleContainer>
);
