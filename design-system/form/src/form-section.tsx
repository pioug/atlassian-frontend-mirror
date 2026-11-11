/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { css, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import { fg } from '@atlaskit/platform-feature-flags/fg';
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

const semanticFormSectionDescriptionStyles = css({
	marginBlockStart: token('space.gap.medium'),
});

const formSectionWrapperStyles = css({
	marginBlockStart: token('space.300'),
});

const semanticFormSectionWrapperStyles = css({
	marginBlockStart: token('space.gap.xxlarge'),
});

const FormSectionWrapper = ({ children }: { children?: ReactNode }) => {
	return (
		<div
			css={[
				formSectionWrapperStyles,
				fg('platform-semantic-spacing') && semanticFormSectionWrapperStyles,
			]}
		>
			{children}
		</div>
	);
};

const FormSectionDescription = ({ children }: { children: ReactNode }) => {
	return (
		<div
			css={[
				formSectionDescriptionStyles,
				fg('platform-semantic-spacing') && semanticFormSectionDescriptionStyles,
			]}
		>
			{children}
		</div>
	);
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
export const FormSection = ({ children, description, title }: FormSectionProps): JSX.Element => {
	return (
		<FormSectionWrapper>
			{title && <Heading size="medium">{title}</Heading>}
			{description && <FormSectionDescription>{description}</FormSectionDescription>}
			{children}
		</FormSectionWrapper>
	);
};
