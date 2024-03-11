/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */

import { css } from '@emotion/react';

import { akEditorShadowZIndex } from '@atlaskit/editor-shared-styles';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { N40A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { shadowClassNames } from '../../ui/OverflowShadow';
import { shadowObserverClassNames } from '../../ui/OverflowShadow/shadowObserver';

const shadowWidth = 8;

/**
 * TODO: This is close to working and removes a tone of JS from OverflowShadow component
 *
 *  background: linear-gradient(to right, white 30%, rgba(255, 255, 255, 0)),
 *         linear-gradient(to right, rgba(255, 255, 255, 0), white 70%) 100% 0,
 *        linear-gradient(to right, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0)),
 *         linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2)) 100% 0;
 *       background-repeat: no-repeat;
 *       background-color: white;
 *       background-size: 40px 100%, 40px 100%, 14px 100%, 14px 100%;
 *
 *      background-attachment: local, local, scroll, scroll;
 */

const shadowSharedStyle = css({
  [`& .${shadowClassNames.RIGHT_SHADOW}::before, .${shadowClassNames.RIGHT_SHADOW}::after, .${shadowClassNames.LEFT_SHADOW}::before, .${shadowClassNames.LEFT_SHADOW}::after`]:
    {
      display: 'none',
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: akEditorShadowZIndex,
      width: `${shadowWidth}px`,
      content: "''",
      height: 'calc(100%)',
    },
  [`& .${shadowClassNames.RIGHT_SHADOW}, .${shadowClassNames.LEFT_SHADOW}`]: {
    position: 'relative',
  },
  [`& .${shadowClassNames.LEFT_SHADOW}::before`]: {
    background: `linear-gradient( to left, transparent 0, ${token(
      'elevation.shadow.overflow.spread',
      N40A,
    )} ${
      getBooleanFF('platform.editor.table.increase-shadow-visibility_lh89r')
        ? 140
        : 100
    }% ), linear-gradient( to right, ${token(
      'elevation.shadow.overflow.perimeter',
      'transparent',
    )} 0px, transparent 1px )`,
    top: '0px',
    left: 0,
    display: 'block',
  },
  [`& .${shadowClassNames.RIGHT_SHADOW}::after`]: {
    background: `linear-gradient( to right, transparent 0, ${token(
      'elevation.shadow.overflow.spread',
      N40A,
    )} ${
      getBooleanFF('platform.editor.table.increase-shadow-visibility_lh89r')
        ? 140
        : 100
    }% ), linear-gradient( to left, ${token(
      'elevation.shadow.overflow.perimeter',
      'transparent',
    )} 0px, transparent 1px )`,
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
    left: `calc(100% - ${shadowWidth}px)`,
    top: '0px',
    display: 'block',
  },
  [`& .${shadowObserverClassNames.SENTINEL_LEFT}`]: {
    height: '100%',
    width: '0px',
    minWidth: '0px',
  },
  [`& .${shadowObserverClassNames.SENTINEL_RIGHT}`]: {
    height: '100%',
    width: '0px',
    minWidth: '0px',
  },
});

export { shadowSharedStyle };
