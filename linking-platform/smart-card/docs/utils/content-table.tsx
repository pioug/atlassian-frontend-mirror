import React from 'react';

import Heading from '@atlaskit/heading';
import Link from '@atlaskit/link';
import { Box, Stack } from '@atlaskit/primitives/compiled';

const ContentTable = ({ items = [] }: { items: { name: string; content: any }[] }) => {
	return (
		<Stack space="space.150">
			<Stack as="ul">
				{items.map(({ name }, idx: number) => (
					<li>
						<Link href={`#content_${idx}`}>{name}</Link>
					</li>
				))}
			</Stack>
			{items.map(({ name, content }, idx: number) => (
				<React.Fragment>
					<Box id={`content_${idx}`} paddingBlockStart="space.200">
						<Heading size="medium">{name}</Heading>
					</Box>
					{content}
				</React.Fragment>
			))}
		</Stack>
	);
};

export default ContentTable;
