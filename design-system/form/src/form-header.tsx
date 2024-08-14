/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Heading from '@atlaskit/heading';
import { Box, xcss } from '@atlaskit/primitives';

export interface FormHeaderProps {
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

const formHeaderContentStyles = xcss({
	minWidth: '100%',
	marginBlockStart: 'space.100',
});

const formHeaderDescriptionStyles = xcss({
	marginBlockStart: 'space.100',
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
		<Box>
			{title && <Heading size="large">{title}</Heading>}
			{description && <Box xcss={formHeaderDescriptionStyles}>{description}</Box>}
			{children && <Box xcss={formHeaderContentStyles}>{children}</Box>}
		</Box>
	);
};

export default FormHeader;
