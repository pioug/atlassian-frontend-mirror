/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import PremiumIcon from '@atlaskit/icon/glyph/premium';
import { ActionName, FooterBlock } from '../../src';
import ExampleContainer from './example-container';

const styles = css`
  [data-smart-element-badge] {
    opacity: 0.2;
  }
`;

export default () => (
  <ExampleContainer>
    <FooterBlock
      actions={[
        {
          name: ActionName.CustomAction,
          icon: <DownloadIcon label="download" />,
          content: 'Download',
          onClick: () => {},
        },
        {
          name: ActionName.CustomAction,
          icon: <PremiumIcon label="magic" />,
          content: 'Magic!',
          onClick: () => {},
        },
      ]}
      overrideCss={styles}
    />
  </ExampleContainer>
);
