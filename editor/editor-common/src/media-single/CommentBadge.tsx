/** @jsx jsx */
import { useEffect, useState } from 'react';

import { css, jsx } from '@emotion/react';
import debounce from 'lodash/debounce';
import type { IntlShape } from 'react-intl-next';

import { CustomThemeButton } from '@atlaskit/button';
import { akEditorUnitZIndex } from '@atlaskit/editor-shared-styles';
import CommentIcon from '@atlaskit/icon/glyph/comment';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

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
  mediaElement?: HTMLElement | null;
  onClick: (e: React.MouseEvent) => void;
  isEditor?: boolean;
};

export const CommentBadge = ({
  intl,
  width,
  height,
  mediaElement,
  onClick,
  isEditor = false,
}: CommentBadgeProps) => {
  const [badgeSize, setBadgeSize] = useState<'medium' | 'small'>(
    getBadgeSize(width, height),
  );
  const title = intl.formatMessage(messages.viewAndAddCommentsOnMedia);

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

  return (
    <div
      css={
        isEditor
          ? [commentBadgeWrapper, commentBadgeEditorOverrides]
          : commentBadgeWrapper
      }
    >
      <CustomThemeButton
        style={{
          height: badgeDimensions,
          width: badgeDimensions,
          background: token(
            'color.background.accent.yellow.subtler',
            '#F8E6A0',
          ),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onClick={onClick}
        iconAfter={<CommentIcon label={title} size={badgeSize} />}
      />
    </div>
  );
};
