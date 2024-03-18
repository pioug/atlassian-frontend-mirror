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

const commonCellElementStyles = css({
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  // indentBase is re-used elsewhere and is primarily used as positive value; we need to negate it here
  marginInlineStart: `calc(${indentBase} * -1)`,
});

const commonChevronContainerStyles = css({
  // Aligns position:absolute chevron button with the adjacent text. Any future visual breaking changes
  // should consider setting this to `-2px` for better alignment, or refactor completely
  marginBlockStart: -3,
});

type ChevronContainerProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
};

/**
 * __Chevron container__
 *
 * A wrapper container around the expand table tree button.
 */
export const ChevronContainer: FC<ChevronContainerProps> = (props) => (
  <span
    // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
    {...props}
    css={[commonCellElementStyles, commonChevronContainerStyles]}
  />
);

const loadingItemContainerStyles = css({
  width: '100%',
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
      commonCellElementStyles,
      loadingItemContainerStyles,
      isRoot && paddingLeftStyles,
    ]}
    // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
    {...props}
  />
);
