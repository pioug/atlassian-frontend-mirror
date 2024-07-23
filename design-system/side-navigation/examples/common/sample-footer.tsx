/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Icon from '@atlaskit/icon';
import { type CustomItemComponentProps } from '@atlaskit/menu';
import { Anchor, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { Footer } from '../../src';

import SampleIcon from './next-gen-project-icon';

export const CustomItemFooter = ({ children, ...props }: CustomItemComponentProps) => {
	const Component = props.onClick ? 'a' : 'div';
	return (
		<Component
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...props}
		>
			{children}
		</Component>
	);
};

const descriptionLinkStyles = xcss({
	fontWeight: token('font.weight.medium'),
	color: 'color.text.subtle',
	textDecoration: 'none',

	':hover': {
		color: 'color.text.subtle',
	},
});

// This example footer conforms to a design taken from Jira designs found at
// https://www.figma.com/file/GA22za6unqO2WsBWM0Ddxk/Jira-navigation-3?node-id=124%3A7194
const ExampleFooter = () => (
	<Footer
		useDeprecatedApi={false}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
		description={
			<Fragment>
				<Anchor href="/feedback" xcss={descriptionLinkStyles}>
					Give feedback
				</Anchor>
				{' ∙ '}
				<Anchor href="/learn" xcss={descriptionLinkStyles}>
					Learn more
				</Anchor>
			</Fragment>
		}
		iconBefore={<Icon label="mode" glyph={SampleIcon} />}
	>
		You're in a next-gen project
	</Footer>
);

export default ExampleFooter;
