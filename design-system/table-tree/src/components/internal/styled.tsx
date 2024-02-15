/** @jsx jsx */
import type { FC, HTMLAttributes, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const indentBase = token('space.300', '25px');

const treeRowContainerStyles = css({
  display: 'flex',
  borderBlockEnd: `1px solid ${token('color.border', N30)}`,
});

/**
 * __Tree row container__
 */
export const TreeRowContainer: FC<
  HTMLAttributes<HTMLDivElement> & { children: ReactNode }
> = (props) => (
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
  <div role="row" css={treeRowContainerStyles} {...props} />
);

const commonChevronContainerStyles = css({
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  insetBlockStart: 7,
  marginInlineStart: `calc(${indentBase} * -1)`,
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

const loadingItemContainerStyles = css({
  width: '100%',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  paddingBlockStart: 5,
});

const paddingLeftStyles = css({
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  paddingInlineStart: '50%',
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
