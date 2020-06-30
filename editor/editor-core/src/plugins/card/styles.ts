import { css } from 'styled-components';
import { akEditorSelectedNodeClassName } from '../../styles';
import { getSelectionStyles } from '../selection/utils';
import { SelectionStyle } from '../selection/types';
import { N20 } from '@atlaskit/theme/colors';
import { SmartCardSharedCssClassName } from '@atlaskit/editor-common';

export const smartCardStyles = css`
  .${SmartCardSharedCssClassName.INLINE_CARD_CONTAINER} {
    max-width: calc(100% - 20px);
    vertical-align: top;
    word-break: break-all;

    .card {
      padding-left: 2px;
      padding-right: 2px;

      .${SmartCardSharedCssClassName.LOADER_WRAPPER} > a:focus {
        ${getSelectionStyles([SelectionStyle.BoxShadow])}
      }
    }

    &.${akEditorSelectedNodeClassName}
      .${SmartCardSharedCssClassName.LOADER_WRAPPER}
      > a {
      ${getSelectionStyles([SelectionStyle.BoxShadow])}
    }
  }

  .${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER} {
    .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div {
      cursor: pointer;
      &:hover {
        background-color: ${N20};
      }
    }

    &.${akEditorSelectedNodeClassName}
      .${SmartCardSharedCssClassName.LOADER_WRAPPER}
      > div {
      ${getSelectionStyles([SelectionStyle.BoxShadow])}
    }
  }

  .${SmartCardSharedCssClassName.EMBED_CARD_CONTAINER} {
    .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div {
      cursor: pointer;
      &::after {
        transition: box-shadow 0s;
      }
    }
    &.${akEditorSelectedNodeClassName}
      .${SmartCardSharedCssClassName.LOADER_WRAPPER}
      > div {
      ${getSelectionStyles([SelectionStyle.BoxShadow])}
    }

    &.${akEditorSelectedNodeClassName}
      .${SmartCardSharedCssClassName.LOADER_WRAPPER}
      > div::after {
      ${getSelectionStyles([SelectionStyle.BoxShadow])}
    }
  }
`;
