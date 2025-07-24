// TODO: Remove this eslint-disable when prop names have been renamed.
// This rule is here as prop name changes are a major as they are used
// by our consumers. The prop name concerned here is truncateTitle.
// This can be done in the next lite-mode conversion.
/* eslint-disable @repo/internal/react/boolean-prop-naming-convention */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { type ReactNode } from 'react';

import { css } from '@compiled/react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	bottomBar: {
		marginBlockStart: token('space.200'),
	},
});

const truncateStyles = css({
	overflowX: 'hidden',
	overflowY: 'hidden', // `overflow-y` necessary to prevent a scrollbar from showing in FF: https://product-fabric.atlassian.net/browse/PYX-1035
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

const outerStyles = css({
	marginBlockEnd: token('space.200', '16px'),
	marginBlockStart: token('space.300', '24px'),
	marginInlineEnd: 0,
	marginInlineStart: 0,
});

const titleStyles = css({
	color: token('color.text'),
	font: token('font.heading.large'),
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	letterSpacing: 'normal',
	marginBlockStart: 0,
	outline: 'none',
});

const titleWrapperStyles = css({
	display: 'flex',
	alignItems: 'flex-start',
	flexWrap: 'nowrap',
});

const titleWrapperTruncateStyles = css({
	flexWrap: 'nowrap',
});

const titleContainerStyles = css({
	minWidth: 0,
	maxWidth: '100%',
	flex: '1 1 auto',
	marginBlockEnd: token('space.100', '8px'),
	overflowWrap: 'break-word',
});

const actionStyles = css({
	maxWidth: '100%',
	flex: '0 0 auto',
	marginBlockEnd: token('space.100', '8px'),
	marginInlineStart: 'auto',
	paddingInlineStart: token('space.400', '32px'),
	whiteSpace: 'nowrap',
});

const titleContainerTruncateStyles = css({
	flexShrink: 1,
});

/**
 * __Outer wrapper__.
 *
 * An outer wrapper that is the outermost component of the PageHeader component. It wraps around the PageHeader, its Actions,
 * the BottomBar and its Breadcrumbs.
 *
 */
export const OuterWrapper = ({ children }: { children: ReactNode }) => {
	return <div css={outerStyles}>{children}</div>;
};

interface StyledTitleWrapperProps {
	children?: React.ReactNode;
	id?: string;
	truncateTitle?: boolean;
	testId?: string;
}

/**
 * __Styled title wrapper__.
 *
 * A styled title wrapper is a wrapper around the title that controls its the styles exclusively.
 *
 */
export const StyledTitleWrapper = React.forwardRef<HTMLHeadingElement, StyledTitleWrapperProps>(
	({ children, id, truncateTitle, testId }, ref) => {
		return (
			// eslint-disable-next-line @atlaskit/design-system/use-heading
			<h1
				css={[titleStyles, truncateTitle && truncateStyles]}
				ref={ref}
				tabIndex={-1}
				id={id}
				data-testid={testId && `${testId}--title`}
			>
				{children}
			</h1>
		);
	},
);

interface TitleProps {
	truncateTitle?: boolean;
	children?: ReactNode;
}

/**
 * __Title wrapper__.
 *
 * A title wrapper is a wrapper around the title and the actions.
 *
 */
export const TitleWrapper = ({ children, truncateTitle }: TitleProps) => {
	return (
		<div css={[titleWrapperStyles, truncateTitle && titleWrapperTruncateStyles]}>{children}</div>
	);
};

/**
 * Title container.
 *
 * A title container is a container that wraps around the title and its styles (if applied).
 *
 */
export const TitleContainer = ({ children, truncateTitle }: TitleProps) => {
	return (
		<div css={[titleContainerStyles, truncateTitle && titleContainerTruncateStyles]}>
			{children}
		</div>
	);
};

/**
 * __Actions wrapper__.
 *
 * An actions wrapper is a wrapper for the actions, which appear on the top right of the PageHeader component.
 *
 */
export const ActionsWrapper = ({ children }: { children: ReactNode }) => {
	return <div css={actionStyles}>{children}</div>;
};

/**
 * __Bottom bar wrapper__.
 *
 * A bottom bar wrapper is a wrapper for the bottom bar, which appears at the bottom of the PageHeader component.
 *
 */
export const BottomBarWrapper = ({ children }: { children: ReactNode }) => {
	return <Box xcss={styles.bottomBar}>{children}</Box>;
};
