/** @jsx jsx */
import type { ReactNode } from 'react';

import { ClassNames, css, jsx } from '@emotion/core';

import { B100 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

type SlotFocusRingProps = {
  children: (props: { className: string }) => ReactNode;
  isSidebar?: boolean;
};

const focusStyles = css({
  ':focus': {
    outline: 'none',
    // eslint-disable-next-line @repo/internal/styles/no-nested-styles
    '> div': {
      boxShadow: `0px 0px 0px 2px inset ${token('color.border.focused', B100)}`,
      outline: 'none',
    },
  },
});

/**
 * Sidebars have an outer and inner component,
 * so the nested selector needs to target an extra level deeper.
 */
const sidebarFocusStyles = css({
  ':focus': {
    outline: 'none',
    // eslint-disable-next-line @repo/internal/styles/no-nested-styles
    '> div > div': {
      boxShadow: `0px 0px 0px 2px inset ${token('color.border.focused', B100)}`,
      outline: 'none',
    },
  },
});

/**
 * We don't use `@atlaskit/focus-ring` here,
 * because we need inset focus styles and:
 *
 * 1. If we set them directly to the layout element,
 *    then any child element's background will cover the shadow.
 * 2. We cannot wrap `children` in `FocusRing`,
 *    because there's no guarantee the passed child takes `className`.
 */
const SlotFocusRing = ({ children, isSidebar = false }: SlotFocusRingProps) => {
  return (
    <ClassNames>
      {({ css }) =>
        children({
          className: isSidebar ? css(sidebarFocusStyles) : css(focusStyles),
        })
      }
    </ClassNames>
  );
};

export default SlotFocusRing;
