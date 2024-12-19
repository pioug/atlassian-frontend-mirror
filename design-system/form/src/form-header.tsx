import React, { type ReactNode } from 'react';

import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

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

const formHeaderContentStyles = cssMap({
	root: {
		minWidth: '100%',
		marginBlockStart: token('space.100'),
	},
});

const formHeaderDescriptionStyles = cssMap({
	root: {
		marginBlockStart: token('space.100'),
	},
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
			{description && <Box xcss={formHeaderDescriptionStyles.root}>{description}</Box>}
			{children && <Box xcss={formHeaderContentStyles.root}>{children}</Box>}
		</Box>
	);
};

export default FormHeader;
