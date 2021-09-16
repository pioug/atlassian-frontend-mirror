/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { DN90A, N100A } from '@atlaskit/theme/colors';
import { themed, useGlobalTheme } from '@atlaskit/theme/components';
import { layers } from '@atlaskit/theme/constants';

const backgroundColor = themed({ light: N100A, dark: DN90A });

// IE11 and Edge: z-index needed because fixed position calculates z-index relative
// to body instead of nearest stacking context (Portal in our case).
const blanketStyles = css({
  position: 'fixed',
  zIndex: layers.spotlight(),
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  transition: 'opacity 220ms',
});

type BlanketProps = {
  isTinted?: boolean;
  style?: React.CSSProperties;
};

/**
 * __Blanket__
 *
 * A replacement for `@atlaskit/blanket`.
 *
 * We use this for spotlights instead of `@atlaskit/blanket`
 * because spotlights must sit on top of other layered elements,
 * such as modals, which have their own blankets.
 *
 * @internal
 */
const Blanket: React.FC<BlanketProps> = (props) => {
  const theme = useGlobalTheme();
  return (
    <div
      css={blanketStyles}
      style={
        {
          ...props.style,
          backgroundColor: props.isTinted
            ? backgroundColor({ theme })
            : 'transparent',
        } as React.CSSProperties
      }
    />
  );
};

export default Blanket;
