/** @jsx jsx */
import { useEffect, useMemo, useState } from 'react';

import { css, jsx } from '@emotion/react';
import debounce from 'lodash/debounce';
import type { IntlShape } from 'react-intl-next';

import { CustomThemeButton } from '@atlaskit/button';
import { akEditorUnitZIndex } from '@atlaskit/editor-shared-styles';
import CommentIcon from '@atlaskit/icon/glyph/comment';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { commentMessages as messages } from '../media';

const commentBadgeWrapper = css({
  position: 'absolute',
  // closest parent element with position relative is .resizer-hover-zone, which includes 10px padding
  right: '2px',
  top: '2px',
  borderRadius: '3px',
  zIndex: akEditorUnitZIndex * 10,
});

const commentBadgeEditorOverrides = css({
  right: '14px',
  zIndex: layers.card(),
});

const getBadgeSize = (width?: number, height?: number) => {
  // width is the original width of image, not resized or currently rendered to user. Defaulting to medium for now
  return (width && width < 70) || (height && height < 70) ? 'small' : 'medium';
};

export type CommentBadgeProps = {
  intl: IntlShape;
  width?: number;
  height?: number;
  status?: 'default' | 'entered' | 'active';
  mediaElement?: HTMLElement | null;
  onClick: (e: React.MouseEvent) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  isEditor?: boolean;
};

export const CommentBadge = ({
  intl,
  width,
  height,
  status = 'default',
  mediaElement,
  onClick,
  onMouseEnter,
  onMouseLeave,
  isEditor = false,
}: CommentBadgeProps) => {
  const [badgeSize, setBadgeSize] = useState<'medium' | 'small'>(
    getBadgeSize(width, height),
  );
  const title = intl.formatMessage(messages.viewCommentsOnMedia);

  useEffect(() => {
    const observer = new ResizeObserver(
      debounce((entries) => {
        const [entry] = entries;
        const { width, height } = entry.contentRect;
        setBadgeSize(getBadgeSize(width, height));
      }),
    );

    if (mediaElement) {
      observer.observe(mediaElement as HTMLElement);
    }
    return () => {
      observer.disconnect();
    };
  }, [mediaElement]);

  const badgeDimensions = badgeSize === 'medium' ? '24px' : '16px';

  const colourToken = useMemo(() => {
    switch (status) {
      case 'active':
        return token(
          'color.background.accent.yellow.subtlest.pressed',
          '#F5CD47',
        );
      case 'entered':
        return token(
          'color.background.accent.yellow.subtlest.hovered',
          '#F8E6A0',
        );
      default:
        return token('color.background.accent.yellow.subtlest', '#FFF7D6');
    }
  }, [status]);

  return (
    <div
      css={
        isEditor
          ? [commentBadgeWrapper, commentBadgeEditorOverrides]
          : commentBadgeWrapper
      }
    >
      <Tooltip position="top" content={title}>
        <CustomThemeButton
          style={{
            height: badgeDimensions,
            width: badgeDimensions,
            background: colourToken,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          iconAfter={<CommentIcon label={title} size={badgeSize} />}
        />
      </Tooltip>
    </div>
  );
};
