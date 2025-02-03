import React, { Fragment, type MouseEvent } from 'react';

import Icon from '@atlaskit/icon';
import { Anchor, Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { Footer, NavigationFooter } from '../src';

import SampleIcon from './common/next-gen-project-icon';

const descriptionLinkStyles = xcss({
	fontWeight: token('font.weight.medium'),
	color: 'color.text.subtle',
	textDecoration: 'none',

	':hover': {
		color: 'color.text.subtle',
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
							<Anchor href="/feedback" xcss={descriptionLinkStyles}>
								Give feedback
							</Anchor>
							{' ∙ '}
							<Anchor href="/learn" xcss={descriptionLinkStyles}>
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
							<Anchor href="/feedback" xcss={descriptionLinkStyles}>
								Give feedback
							</Anchor>
							{' ∙ '}
							<Anchor href="/learn" xcss={descriptionLinkStyles}>
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
