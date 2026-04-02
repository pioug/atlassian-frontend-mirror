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
import { token } from '@atlaskit/tokens';

const titleContainerStyles = css({
	minWidth: 0,
	maxWidth: '100%',
	flex: '1 1 auto',
	marginBlockEnd: token('space.100'),
	overflowWrap: 'break-word',
});

const titleContainerTruncateStyles = css({
	flexShrink: 1,
});

interface TitleProps {
	truncateTitle?: boolean;
	children?: ReactNode;
}

/**
 * Title container.
 *
 * A title container is a container that wraps around the title and its styles (if applied).
 *
 */
const TitleContainer: ({ children, truncateTitle }: TitleProps) => JSX.Element = ({
	children,
	truncateTitle,
}: TitleProps) => {
	return (
		<div css={[titleContainerStyles, truncateTitle && titleContainerTruncateStyles]}>
			{children}
		</div>
	);
};

export default TitleContainer;
