/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import LikeIcon from '../../glyph/like';
import { B500, Y500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import WarningIcon from '../../glyph/warning';

const stylesStyles = css({
  color: token('color.icon.warning', Y500),
});

const IconPrimaryColorExample = () => {
  return (
    <div css={stylesStyles}>
      {/* primaryColor is explicitly set */}
      <LikeIcon primaryColor={token('color.icon.brand', B500)} label="" />
      {/* inherited from the color prop of the parent element */}
      <WarningIcon label="" />
    </div>
  );
};

export default IconPrimaryColorExample;
