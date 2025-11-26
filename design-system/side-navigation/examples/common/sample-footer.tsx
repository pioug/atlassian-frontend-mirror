/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment } from 'react';

import { cssMap, jsx } from '@compiled/react';

import PremiumIcon from '@atlaskit/icon/core/premium';
import { type CustomItemComponentProps } from '@atlaskit/menu';
import { Anchor } from '@atlaskit/primitives/compiled';
import { Footer } from '@atlaskit/side-navigation';
import { token } from '@atlaskit/tokens';

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
		iconBefore={<PremiumIcon label="" />}
	>
		You're in a next-gen project
	</Footer>
);

export default ExampleFooter;
