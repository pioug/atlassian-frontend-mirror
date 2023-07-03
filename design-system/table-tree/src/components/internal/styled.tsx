/** @jsx jsx */
import { FC, HTMLAttributes, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { N30, N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const iconColor = token('color.text', N800);
export const indentBase = token('space.300', '25px');

const treeRowContainerStyles = css({
  display: 'flex',
  borderBottom: `1px solid ${token('color.border', N30)}`,
});

/**
 * __Tree row container__
 */
export const TreeRowContainer: FC<
  HTMLAttributes<HTMLDivElement> & { children: ReactNode }
> = (props) => (
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
  <div css={treeRowContainerStyles} {...props} />
);

const commonChevronContainerStyles = css({
  display: 'flex',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  marginLeft: `calc(${indentBase} * -1)`,
  position: 'absolute',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  top: 7,
  alignItems: 'center',
});

type ChevronContainerProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
};

/**
 * __Chevron container__
 *
 * A wrapper container around the expand table tree button.
 */
export const ChevronContainer: FC<ChevronContainerProps> = (
  props,
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
) => <span {...props} css={commonChevronContainerStyles} />;

const chevronIconContainerStyles = css({
  position: 'relative',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  top: 1,
});

/**
 * __Chevron icon container__
 *
 * A chevron icon container.
 */
export const ChevronIconContainer: FC<ChevronContainerProps> = (
  props,
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
) => <span {...props} css={chevronIconContainerStyles} />;

const loadingItemContainerStyles = css({
  width: '100%',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  paddingTop: 5,
});

const paddingLeftStyles = css({
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  paddingLeft: '50%',
});

type LoaderItemContainerProps = {
  isRoot?: boolean;
  children: ReactNode;
};

/**
 * __Loader item container__
 *
 * A loader item container.
 */
export const LoaderItemContainer: FC<LoaderItemContainerProps> = ({
  isRoot,
  ...props
}) => (
  <span
    css={[
      commonChevronContainerStyles,
      loadingItemContainerStyles,
      isRoot && paddingLeftStyles,
    ]}
    // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
    {...props}
  />
);
