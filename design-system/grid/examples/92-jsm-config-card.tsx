import React, { type FC, Fragment, type ReactNode } from 'react';

import Heading from '@atlaskit/heading';
import Link from '@atlaskit/link';
import Stack from '@atlaskit/primitives/stack';

import IconLink from './95-icon-link';

const JSMConfigCard: FC<{
	title: string;
	children?: ReactNode;
}> = ({
	children = (
		<Fragment>
			<IconLink>Join Figma support slack channel</IconLink>
			<IconLink>Request for laptop exchange</IconLink>
			<IconLink>Tutorials and shared resources</IconLink>
			<Link href="#id">Show 3 more</Link>
		</Fragment>
	),
	title = 'Title',
}) => {
	return (
		<Stack space="space.150">
			<Heading as="h2" size="medium">
				{title}
			</Heading>
			{children}
		</Stack>
	);
};

export default JSMConfigCard;
