/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { useGlobalTheme } from '@atlaskit/theme/components';
import {
  borderRadius as getBorderRadius,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';
import { h600 } from '@atlaskit/theme/typography';

const gridSize = getGridSize();
const borderRadius = getBorderRadius();
const actionItemBottomMargin = gridSize / 2;

// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const lightH600Styles = css(h600({ theme: { mode: 'light' } }));
// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const darkH600Styles = css(h600({ theme: { mode: 'dark' } }));

const modalBodyStyles = css({
  padding: '40px 20px',
  textAlign: 'center',
});

// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const modalHeadingStyles = css({
  marginBottom: `${gridSize}px`,
  color: 'inherit',
});

const modalImageStyles = css({
  width: '100%',
  height: 'auto',
  borderTopLeftRadius: `${borderRadius}px`,
  borderTopRightRadius: `${borderRadius}px`,
  '@media (min-width: 320px) and (max-width: 480px)': {
    borderRadius: 0,
  },
});

const modalActionContainerStyles = css({
  display: 'flex',
  padding: `0 40px ${40 - actionItemBottomMargin}px`,
  justifyContent: 'center',
  flexDirection: 'row',
  flexFlow: 'wrap',
});

const modalActionContainerReversedStyles = css({
  flexDirection: 'row-reverse',
});

const modalActionItemStyles = css({
  margin: `0 ${gridSize / 2}px ${actionItemBottomMargin}px`,
});

/**
 * __Modal body__
 *
 * @internal
 */
export const ModalBody: React.FC<{}> = ({ children }) => (
  <div css={modalBodyStyles}>{children}</div>
);

/**
 * __Modal heading__
 *
 * @internal
 */
export const ModalHeading: React.FC<{}> = ({ children }) => {
  const { mode } = useGlobalTheme();
  return (
    <h4
      css={[
        mode === 'light' ? lightH600Styles : darkH600Styles,
        modalHeadingStyles,
      ]}
    >
      {children}
    </h4>
  );
};

/**
 * __Modal image__
 *
 * @internal
 */
export const ModalImage: React.FC<{ alt: string; src?: string }> = ({
  alt,
  src,
}) => <img css={modalImageStyles} alt={alt} src={src} />;

/**
 * __Modal action container__
 *
 * @internal
 */
export const ModalActionContainer: React.FC<{
  shouldReverseButtonOrder: boolean;
}> = ({ children, shouldReverseButtonOrder }) => (
  <div
    css={[
      modalActionContainerStyles,
      shouldReverseButtonOrder && modalActionContainerReversedStyles,
    ]}
  >
    {children}
  </div>
);

/**
 * __Modal action item__
 *
 * @internal
 */
export const ModalActionItem: React.FC<{}> = ({ children }) => (
  <div css={modalActionItemStyles}>{children}</div>
);
