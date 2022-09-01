/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import FocusRing from '@atlaskit/focus-ring';
import { borderRadius, codeFontFamily } from '@atlaskit/theme/constants';

import { token } from '../../../src';

import CopyToClipboard from './copy-to-clipboard';

const copyValueBaseStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  minHeight: 24,
  padding: '2px 12px',
  alignItems: 'center',
  justifyContent: 'center',
  background: token('color.background.neutral', '#091E420F'),
  borderRadius: borderRadius(),
  color: token('color.text', '#172B4D'),
  fontFamily: codeFontFamily(),
  fontSize: 12,
  lineHeight: 1,
});

const copyValueButtonStyles = css({
  appearance: 'none',
  border: 'none',
  cursor: 'pointer',

  '&:hover, &:focus': {
    background: token('color.background.neutral.hovered', '#091E4224'),
  },

  '&:active': {
    background: token('color.background.neutral.pressed', '#091E424F'),
  },
});

interface CopyButtonProps {
  /**
   * The value to copy to the clipboard. If not specified, copy functionality will
   * be disabled
   */
  copyValue?: string;
  children: ReactNode;
  className?: string;
}

const CopyButton = ({ copyValue, children, className }: CopyButtonProps) =>
  copyValue ? (
    <CopyToClipboard value={copyValue}>
      {({ copy }) => (
        <FocusRing>
          <button
            css={[copyValueBaseStyles, copyValueButtonStyles]}
            type="button"
            onClick={copy}
            className={className}
            onMouseDown={(event: React.MouseEvent<HTMLElement>) => {
              event.preventDefault();
            }}
          >
            {children}
          </button>
        </FocusRing>
      )}
    </CopyToClipboard>
  ) : (
    <div css={copyValueBaseStyles} className={className}>
      {children}
    </div>
  );

export default CopyButton;
