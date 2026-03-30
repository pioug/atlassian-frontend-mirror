// TODO: Remove this eslint-disable when prop names have been renamed.
// This rule is here as prop name changes are a major as they are used
// by our consumers. The prop name concerned here is truncateTitle.
// This can be done in the next lite-mode conversion.
/* eslint-disable @repo/internal/react/boolean-prop-naming-convention */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode } from 'react';

import { css } from '@compiled/react';

import { jsx } from '@atlaskit/css';

const titleWrapperStyles = css({
	display: 'flex',
	alignItems: 'flex-start',
	flexWrap: 'nowrap',
});

const titleWrapperTruncateStyles = css({
	flexWrap: 'nowrap',
});

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
const TitleWrapper: ({ children, truncateTitle }: TitleProps) => JSX.Element = ({
	children,
	truncateTitle,
}: TitleProps) => {
	return (
		<div css={[titleWrapperStyles, truncateTitle && titleWrapperTruncateStyles]}>{children}</div>
	);
};

export default TitleWrapper;
