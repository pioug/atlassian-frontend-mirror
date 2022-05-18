/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ActionName, FooterBlock, TitleBlock } from '../../src';
import ExampleContainer from './example-container';

const styles = css`
  margin-top: 4px;
  [data-smart-element-icon],
  [data-smart-element-link],
  [data-smart-element-badge] {
    opacity: 0.2;
  }
`;

export default () => (
  <ExampleContainer>
    <TitleBlock
      actions={[
        { name: ActionName.EditAction, onClick: () => {} },
        { name: ActionName.DeleteAction, onClick: () => {} },
      ]}
      overrideCss={styles}
    />
    <FooterBlock
      actions={[
        { name: ActionName.EditAction, onClick: () => {} },
        { name: ActionName.DeleteAction, onClick: () => {} },
      ]}
      overrideCss={styles}
    />
  </ExampleContainer>
);
