/** @jsx jsx */
import { useEffect, useState } from 'react';

import { css, jsx } from '@emotion/react';
import debounce from 'lodash/debounce';
import type { IntlShape } from 'react-intl-next';

import { CustomThemeButton } from '@atlaskit/button';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import CommentIcon from '@atlaskit/icon/glyph/comment';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { commentMessages as messages } from '../media';

const commentBadgeWrapper = css({
  position: 'absolute',
  // closest parent element with position relative is .resizer-hover-zone, which includes 10px padding
  right: '14px',
  top: '2px',
  borderRadius: '3px',
  zIndex: layers.card(),
});

const getDefaultSize = (node: PMNode | null) => {
  // width is the original width of image, not resized or currently rendered to user. Defaulting to medium for now
  return !node || node.attrs.width > 70 ? 'medium' : 'small';
};

type CommentBadgeProps = {
  intl: IntlShape;
  mediaNode: PMNode | null;
  view: EditorView;
  mediaElement?: HTMLElement;
  onClick: () => void;
};

export const CommentBadge = ({
  intl,
  mediaNode,
  mediaElement,
  onClick,
}: CommentBadgeProps) => {
  const [badgeSize, setBadgeSize] = useState<'medium' | 'small'>(
    getDefaultSize(mediaNode),
  );
  const title = intl.formatMessage(messages.viewAndAddCommentsOnMedia);

  useEffect(() => {
    const observer = new ResizeObserver(
      debounce((entries) => {
        const [entry] = entries;
        const { width, height } = entry.contentRect;
        setBadgeSize(width > 70 || height > 70 ? 'medium' : 'small');
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
    <div css={commentBadgeWrapper}>
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
