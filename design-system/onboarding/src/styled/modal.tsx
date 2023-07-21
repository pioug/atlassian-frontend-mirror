/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { useGlobalTheme } from '@atlaskit/theme/components';
import { h600 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

type ModalImageProps = { alt: string; src?: string };

type ModalActionContainerProps = {
  shouldReverseButtonOrder: boolean;
  children: ReactNode;
};

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
const lightH600Styles = css(h600({ theme: { mode: 'light' } }));
// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
const darkH600Styles = css(h600({ theme: { mode: 'dark' } }));

const modalBodyStyles = css({
  padding: `${token('space.500', '40px')} ${token('space.250', '20px')}`,
  textAlign: 'center',
});

const modalHeadingStyles = css({
  marginBottom: token('space.100', '8px'),
  color: 'inherit',
});

const modalImageStyles = css({
  width: '100%',
  height: 'auto',
  borderTopLeftRadius: token('border.radius', '3px'),
  borderTopRightRadius: token('border.radius', '3px'),
  // TODO: Use new breakpoints
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '@media (min-width: 320px) and (max-width: 480px)': {
    borderRadius: 0,
  },
});

const modalActionContainerStyles = css({
  display: 'flex',
  padding: `${token('space.0', '0px')} ${token('space.500', '40px')} 36px`,
  justifyContent: 'center',
  flexDirection: 'row',
  flexFlow: 'wrap',
});

const modalActionContainerReversedStyles = css({
  flexDirection: 'row-reverse',
});

const modalActionItemStyles = css({
  margin: `${token('space.0', '0px')} ${token('space.050', '4px')} ${token(
    'space.050',
    '4px',
  )}`,
});

/**
 * __Modal body__
 *
 * @internal
 */
export const ModalBody = ({ children }: { children: ReactNode }) => (
  <div css={modalBodyStyles}>{children}</div>
);

/**
 * __Modal heading__
 *
 * @internal
 */
export const ModalHeading = ({ children }: { children: ReactNode }) => {
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
export const ModalImage = ({ alt, src }: ModalImageProps) => (
  <img css={modalImageStyles} alt={alt} src={src} />
);

/**
 * __Modal action container__
 *
 * @internal
 */
export const ModalActionContainer = ({
  children,
  shouldReverseButtonOrder,
}: ModalActionContainerProps) => (
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
export const ModalActionItem = ({ children }: { children: ReactNode }) => (
  <div css={modalActionItemStyles}>{children}</div>
);
