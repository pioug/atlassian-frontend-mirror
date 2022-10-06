/** @jsx jsx */

import { FC, ReactElement, useLayoutEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
import useClipboard from 'react-use-clipboard';

import FocusRing from '@atlaskit/focus-ring';
import Tooltip from '@atlaskit/tooltip';

const baseStyles = css({
  display: 'flex',
  margin: 0,
  padding: 0,
  rowGap: '5px',
  flexDirection: 'column',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  '& + &': {
    marginTop: '10px',
  },
});

const copyMessages = {
  prompt: 'Copy to clipboard',
  success: 'Copied!',
};

interface TokenButtonProps {
  children: ((props: { isHovered?: boolean }) => ReactElement) | ReactElement;
  copyValue?: string;
  shouldFitContainer?: boolean;
  className?: string;
}

const TokenButton: FC<TokenButtonProps> = (props) => {
  const { children, copyValue, shouldFitContainer, className } = props;

  const [isHovered, setIsHovered] = useState(false);

  const [isCopied, setCopied] = useClipboard(copyValue || '', {
    successDuration: 1000,
  });

  // There is a bug with tooltip where it doesn't center correctly
  // when the text is changed.
  const updateTooltip = useRef<() => void>();
  useLayoutEffect(() => {
    updateTooltip.current?.();
  }, [isCopied]);

  return (
    <Tooltip
      content={({ update }) => {
        updateTooltip.current = update;
        return isCopied ? copyMessages.success : copyMessages.prompt;
      }}
      position="top"
      delay={0}
    >
      {(tooltipProps) => (
        <FocusRing>
          <button
            className={className}
            type="button"
            css={[
              baseStyles,
              shouldFitContainer && {
                width: '100%',
              },
            ]}
            {...tooltipProps}
            onClick={(e) => {
              tooltipProps.onClick(e);
              setCopied();
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {children && typeof children === 'function'
              ? children({ isHovered })
              : children}
          </button>
        </FocusRing>
      )}
    </Tooltip>
  );
};

export default TokenButton;
