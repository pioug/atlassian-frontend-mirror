/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, type MouseEvent } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Icon from '@atlaskit/icon';
import { Anchor, Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { Footer, NavigationFooter } from '../src';

import SampleIcon from './common/next-gen-project-icon';

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
					iconBefore={<Icon label="" glyph={SampleIcon} />}
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
