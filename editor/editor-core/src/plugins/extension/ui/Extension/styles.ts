import { css } from '@emotion/react';
import { themed } from '@atlaskit/theme/components';
import { borderRadius } from '@atlaskit/theme/constants';
import { N20, DN50, DN700, B200, N20A, N70 } from '@atlaskit/theme/colors';
import { ThemeProps } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';
import {
  EXTENSION_PADDING,
  BODIED_EXT_PADDING,
} from '@atlaskit/editor-common/styles';

export { EXTENSION_PADDING as padding, BODIED_EXT_PADDING };

export const wrapperDefault = (theme: ThemeProps) => css`
  background: ${themed({
    light: token('color.background.neutral', N20),
    dark: token('color.background.neutral', DN50),
  })(theme)};
  border-radius: ${borderRadius()}px;
  color: ${themed({
    dark: token('color.text', DN700),
  })(theme)};
  position: relative;
  vertical-align: middle;

  .ProseMirror-selectednode > span > & > .extension-overlay {
    box-shadow: inset 0px 0px 0px 2px ${token('color.border.selected', B200)};
    opacity: 1;
  }

  &.with-overlay {
    .extension-overlay {
      background: ${token('color.background.neutral.hovered', N20A)};
      color: transparent;
    }

    &:hover .extension-overlay {
      opacity: 1;
    }
  }
`;

export const overlay = css`
  border-radius: ${borderRadius()}px;
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
`;

export const placeholderFallback = css`
  display: inline-flex;
  align-items: center;

  & > img {
    margin: 0 4px;
  }
  /* TODO: fix in develop: https://atlassian.slack.com/archives/CFG3PSQ9E/p1647395052443259?thread_ts=1647394572.556029&cid=CFG3PSQ9E */
  /* stylelint-disable-next-line */
  label: placeholder-fallback;
`;

export const placeholderFallbackParams = css`
  display: inline-block;
  max-width: 200px;
  margin-left: 5px;
  color: ${token('color.text.subtlest', N70)};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const styledImage = css`
  max-height: 16px;
  max-width: 16px;
  /* TODO: fix in develop: https://atlassian.slack.com/archives/CFG3PSQ9E/p1647395052443259?thread_ts=1647394572.556029&cid=CFG3PSQ9E */
  /* stylelint-disable-next-line */
  label: lozenge-image;
`;
