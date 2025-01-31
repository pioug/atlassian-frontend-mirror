/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { css, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { token } from '@atlaskit/tokens';

interface FormSectionProps {
	/**
	 * Title of the form section.
	 */
	title?: ReactNode;
	/**
	 * Content or components to render after the description.
	 */
	children?: ReactNode;
	/**
	 * Description of the contents of the section.
	 */
	description?: ReactNode;
}

const formSectionDescriptionStyles = css({
	marginBlockStart: token('space.100'),
});

const formSectionWrapperStyles = css({
	marginBlockStart: token('space.300'),
});

const FormSectionWrapper = ({ children }: { children?: ReactNode }) => {
	// eslint-disable-next-line @atlaskit/design-system/use-primitives
	return <div css={formSectionWrapperStyles}>{children}</div>;
};

const FormSectionDescription = ({ children }: { children: ReactNode }) => {
	// eslint-disable-next-line @atlaskit/design-system/use-primitives
	return <div css={formSectionDescriptionStyles}>{children}</div>;
};

/**
 * __Form section__.
 *
 * A form section is used to define a section of a form layout. This contains a section title, content
 * and a description of the section.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/form/docs/layout)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/form/docs/layout)
 * - [Usage](https://atlaskit.atlassian.com/packages/design-system/form/docs/layout).
 */
const FormSection = ({ children, description, title }: FormSectionProps) => {
	return (
		<FormSectionWrapper>
			{title && <Heading size="medium">{title}</Heading>}
			{description && <FormSectionDescription>{description}</FormSectionDescription>}
			{children}
		</FormSectionWrapper>
	);
};

export default FormSection;
