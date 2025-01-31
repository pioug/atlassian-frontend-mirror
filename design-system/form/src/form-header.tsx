/* eslint-disable @atlaskit/design-system/use-primitives */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { css, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { token } from '@atlaskit/tokens';

interface FormHeaderProps {
	/**
	 * Title of the form. This is a header.
	 */
	title?: ReactNode;
	/**
	 * Description or subtitle of the form.
	 */
	description?: ReactNode;
	/**
	 * Child content to render in the form below the title and description.
	 */
	children?: ReactNode;
}

const formHeaderContentStyles = css({
	minWidth: '100%',
	marginBlockStart: token('space.100'),
});

const formHeaderDescriptionStyles = css({
	marginBlockStart: token('space.100'),
});

/**
 * __Form header__.
 *
 * A form header contains the form component's heading and subheadings. This provides the correct padding
 * and styling for it.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/form/docs/layout)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/form/docs/layout)
 * - [Usage](https://atlaskit.atlassian.com/packages/design-system/form/docs/layout).
 */
const FormHeader = ({ children, description, title }: FormHeaderProps) => {
	return (
		<div>
			{title && <Heading size="large">{title}</Heading>}
			{description && <div css={formHeaderDescriptionStyles}>{description}</div>}
			{children && <div css={formHeaderContentStyles}>{children}</div>}
		</div>
	);
};

export default FormHeader;
