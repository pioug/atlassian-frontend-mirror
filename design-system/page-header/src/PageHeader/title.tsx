// TODO: Remove this eslint-disable when prop names have been renamed.
// This rule is here as prop name changes are a major as they are used
// by our consumers. The prop name concerned here is truncateTitle.
// This can be done in the next lite-mode conversion.
/* eslint-disable @repo/internal/react/boolean-prop-naming-convention */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { css } from '@compiled/react';

import { jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const truncateStyles = css({
	overflowX: 'hidden',
	overflowY: 'hidden', // `overflow-y` necessary to prevent a scrollbar from showing in FF: https://product-fabric.atlassian.net/browse/PYX-1035
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

const titleStyles = css({
	color: token('color.text'),
	font: token('font.heading.large'),
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	letterSpacing: 'normal',
	marginBlockStart: 0,
	outline: 'none',
});

interface TitleProps {
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
const Title: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<TitleProps> & React.RefAttributes<HTMLHeadingElement>
> = React.forwardRef<HTMLHeadingElement, TitleProps>(
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

export default Title;
