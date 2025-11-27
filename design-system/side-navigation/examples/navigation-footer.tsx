/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, type MouseEvent } from 'react';

import { cssMap, jsx } from '@compiled/react';

import PremiumIcon from '@atlaskit/icon/core/premium';
import { Anchor, Box } from '@atlaskit/primitives/compiled';
import { Footer, NavigationFooter } from '@atlaskit/side-navigation';
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

const Example = () => {
	return (
		// eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable
		<Box onClick={(e: MouseEvent) => e.preventDefault()}>
			<NavigationFooter>
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
				>
					You're in a next gen-project
				</Footer>
			</NavigationFooter>

			<NavigationFooter>
				<Footer
					useDeprecatedApi={false}
					iconBefore={<PremiumIcon label="" />}
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
				>
					You're in a next gen-project
				</Footer>
			</NavigationFooter>
		</Box>
	);
};

export default Example;
