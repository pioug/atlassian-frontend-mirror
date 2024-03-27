/** @jsx jsx */
import type { CSSProperties } from 'react';

import { css, jsx } from '@emotion/react';
import classnames from 'classnames';

import { N300, N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const labelStyles = css({
  opacity: 0,
  display: 'inline-flex',
  width: 'max-content',
  justifyContent: 'left',
  position: 'absolute',
  // Unfortunately, these need to be these exact numbers - otherwise there will be a gap/noticeable overlap
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
  top: '-18px',
  '&.inline-extension': {
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
    top: '-17px',
    marginLeft: token('space.150', '12px'),
  },
  '&.hovered': {
    background: token('color.background.accent.gray.subtle.pressed', N300),
    color: token('color.text.subtle', N500),
    opacity: 1,
  },
  borderRadius: token('border.radius', '3px'),
  lineHeight: 1,
});

const textStyles = css({
  fontSize: '14px',
  fontWeight: 'normal',
  padding: `${token('space.025', '2px')} ${token('space.050', '4px')}`,
});

type ExtensionLabelProps = {
  text: string;
  extensionName: string;
  isNodeHovered?: boolean;
  customContainerStyles?: CSSProperties;
};

export const ExtensionLabel = ({
  text,
  extensionName,
  isNodeHovered,
  customContainerStyles,
}: ExtensionLabelProps) => {
  const classNames = classnames('extension-title', 'extension-label', {
    'inline-extension': extensionName === 'inlineExtension',
    hovered: isNodeHovered,
  });

  return (
    <div style={customContainerStyles}>
      <span data-testid="new-lozenge" css={labelStyles} className={classNames}>
        <span css={textStyles}>{text}</span>
      </span>
    </div>
  );
};
