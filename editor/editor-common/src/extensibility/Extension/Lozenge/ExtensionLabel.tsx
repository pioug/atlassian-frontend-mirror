/** @jsx jsx */
import type { CSSProperties } from 'react';

import { css, jsx } from '@emotion/react';
import classnames from 'classnames';

import { B400, B50, N300, N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const labelStyles = css({
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
  },
  background: token('color.background.accent.gray.subtle.pressed', N300),
  color: token('color.text.subtle', N500),
  '&.selected': {
    backgroundColor: token('color.background.selected', B50),
    color: token('color.text.selected', B400),
  },
  borderRadius: token('border.radius', '3px'),
  lineHeight: 1,
  marginLeft: token('space.150', '12px'),
});

const textStyles = css({
  fontSize: '14px',
  fontWeight: 'normal',
  padding: `${token('space.025', '2px')} ${token('space.050', '4px')}`,
});

type ExtensionLabelProps = {
  text: string;
  extensionName: string;
  isNodeSelected?: boolean;
  customContainerStyles?: CSSProperties;
};

export const ExtensionLabel = ({
  text,
  extensionName,
  isNodeSelected,
  customContainerStyles,
}: ExtensionLabelProps) => {
  const classNames = classnames('extension-title', 'extension-label', {
    'inline-extension': extensionName === 'inlineExtension',
    selected: isNodeSelected,
  });

  return (
    <div style={customContainerStyles}>
      <span data-testid="new-lozenge" css={labelStyles} className={classNames}>
        <span css={textStyles}>{text}</span>
      </span>
    </div>
  );
};
