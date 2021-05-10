import { css } from '@emotion/core';

import { focusOutlineColor, keylineColor, keylineHeight } from '../constants';

type ScrollableOptions = {
  showTopKeyline: boolean;
  showBottomKeyline: boolean;

  /**
   * This is controlled by the outer modal's `scrollBehavior` prop.
   * Until we consolidate the scroll behaviors, we still need this to determine
   * whether we need to offset the keyline heights.
   */
  shouldScroll?: boolean;
};

const keyline = (showKeyline: boolean) =>
  showKeyline ? `${keylineHeight}px solid ${keylineColor()}` : 'unset';

export const scrollableStyles = ({
  showTopKeyline,
  showBottomKeyline,
  shouldScroll,
}: ScrollableOptions) => css`
  overflow-y: auto;
  overflow-x: ${shouldScroll ? 'hidden' : 'inherit'};

  border-top: ${keyline(showTopKeyline)};
  border-bottom: ${keyline(showBottomKeyline)};

  /**
  * We need to inherit flex styles from its parent here
  * in case they're set because we're essentially being a proxy container
  * between the original flex parent and its children (the modal body).
  */
  display: inherit;
  flex: inherit;
  flex-direction: inherit;

  /**
  * This margin is to match original behavior where we set extra
  * padding on the modal body, depending on the scroll behavior,
  * to offset the keylines.
  *
  * In this conversion, we always add the padding in the body, and
  * remove the extra spacing here if scroll behavior is 'outside'.
  *
  * This logic needs to stay until we consolidate
  * the scroll behaviors.
  */
  margin: -${shouldScroll ? 0 : keylineHeight}px 0px;

  &:focus {
    outline-offset: -1px;
    outline-style: dotted;
    outline-color: ${focusOutlineColor};
    outline-width: thin;
  }

  @media (min-width: 480px) {
    overflow-y: ${shouldScroll ? 'auto' : 'inherit'};
    height: unset;
  }
`;
