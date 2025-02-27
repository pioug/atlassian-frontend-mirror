/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Icon from '@atlaskit/icon';
import { type CustomItemComponentProps } from '@atlaskit/menu';
import { Anchor } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { Footer } from '../../src';

import SampleIcon from './next-gen-project-icon';

const styles = cssMap({
	descriptionLink: {
		fontWeight: token('font.weight.medium'),
		color: token('color.text.subtle'),
		textDecoration: 'none',

		'&:hover': {
			color: token('color.text.subtle'),
		},
	},
});

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

// This example footer conforms to a design taken from Jira designs found at
// https://www.figma.com/file/GA22za6unqO2WsBWM0Ddxk/Jira-navigation-3?node-id=124%3A7194
const ExampleFooter = () => (
	<Footer
		useDeprecatedApi={false}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
		description={
			<Fragment>
				<Anchor href="/feedback" xcss={styles.descriptionLink}>
					Give feedback
				</Anchor>
				{' ∙ '}
				<Anchor href="/learn" xcss={styles.descriptionLink}>
					Learn more
				</Anchor>
			</Fragment>
		}
		iconBefore={<Icon label="" glyph={SampleIcon} />}
	>
		You're in a next-gen project
	</Footer>
);

export default ExampleFooter;
