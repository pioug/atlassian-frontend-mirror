/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { css, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import { fg } from '@atlaskit/platform-feature-flags/fg';
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

const semanticFormHeaderContentStyles = css({
	marginBlockStart: token('space.gap.medium'),
});

const formHeaderDescriptionStyles = css({
	marginBlockStart: token('space.100'),
});

const semanticFormHeaderDescriptionStyles = css({
	marginBlockStart: token('space.gap.medium'),
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
export const FormHeader = ({ children, description, title }: FormHeaderProps): JSX.Element => {
	return (
		<div>
			{title && <Heading size="large">{title}</Heading>}
			{description && (
				<div
					css={[
						formHeaderDescriptionStyles,
						fg('platform-semantic-spacing') && semanticFormHeaderDescriptionStyles,
					]}
				>
					{description}
				</div>
			)}
			{children && (
				<div
					css={[
						formHeaderContentStyles,
						fg('platform-semantic-spacing') && semanticFormHeaderContentStyles,
					]}
				>
					{children}
				</div>
			)}
		</div>
	);
};
