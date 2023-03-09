/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { Manager, Popper, Reference } from '../../src';

const popupStyles = css({
  maxWidth: '160px',
  padding: token('space.100', '8px'),
  background: token('elevation.surface.overlay', 'white'),
  borderRadius: `${borderRadius()}px`,
  boxShadow: token('elevation.shadow.raised', '0 2px 3px rgba(0,0,0,0.2)'),
});

const BasicPositioningExample = () => (
  <Manager>
    <Reference>
      {({ ref }) => (
        <Button appearance="primary" ref={ref}>
          Reference element
        </Button>
      )}
    </Reference>
    <Popper placement="right">
      {({ ref, style }) => (
        <div ref={ref} style={style} css={popupStyles}>
          This text is a popper placed to the right
        </div>
      )}
    </Popper>
  </Manager>
);

export default BasicPositioningExample;
