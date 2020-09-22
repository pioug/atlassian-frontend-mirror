import { css } from 'styled-components';

import { akEditorShadowZIndex } from '@atlaskit/editor-shared-styles';
import { N40A } from '@atlaskit/theme/colors';

import { shadowClassNames } from '../../ui/OverflowShadow';

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

const shadowSharedStyle = css`
  &
    .${shadowClassNames.RIGHT_SHADOW}::before,
    .${shadowClassNames.RIGHT_SHADOW}::after,
    .${shadowClassNames.LEFT_SHADOW}::before,
    .${shadowClassNames.LEFT_SHADOW}::after {
    display: none;
    position: absolute;
    pointer-events: none;
    z-index: ${akEditorShadowZIndex};
    width: ${shadowWidth}px;
    content: '';
    /* Scrollbar is outside the content in IE, inset in other browsers. */
    height: calc(100%);
  }

  & .${shadowClassNames.RIGHT_SHADOW}, .${shadowClassNames.LEFT_SHADOW} {
    position: relative;
  }

  & .${shadowClassNames.LEFT_SHADOW}::before {
    background: linear-gradient(to left, rgba(99, 114, 130, 0) 0, ${N40A} 100%);
    top: 0px;
    left: 0;
    display: block;
  }

  & .${shadowClassNames.RIGHT_SHADOW}::after {
    background: linear-gradient(
      to right,
      rgba(99, 114, 130, 0) 0,
      ${N40A} 100%
    );
    left: calc(100% - ${shadowWidth}px);
    top: 0px;
    display: block;
  }
`;

export { shadowSharedStyle };
