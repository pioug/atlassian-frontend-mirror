/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { ActionName, FooterBlock } from '../../src';
import ExampleContainer from './example-container';

const styles = css({
  '[data-smart-element-badge]': {
    opacity: 0.2,
  },
});

const overrideEditStyles = css({
  button: {
    backgroundColor: token('color.background.accent.green.bolder', '#1F845A'),
  },
  span: {
    color: token('color.text.inverse', '#FFFFFF'),
  },
});

const overrideDeleteStyles = css({
  button: {
    backgroundColor: token('color.background.danger.bold', '#CA3521'),
  },
  span: {
    color: token('color.text.inverse', '#FFFFFF'),
  },
});

export default () => (
  <ExampleContainer>
    <FooterBlock
      actions={[
        {
          name: ActionName.EditAction,
          onClick: () => {},
          overrideCss: overrideEditStyles,
        },
        {
          name: ActionName.DeleteAction,
          onClick: () => {},
          overrideCss: overrideDeleteStyles,
        },
      ]}
      overrideCss={styles}
    />
  </ExampleContainer>
);
