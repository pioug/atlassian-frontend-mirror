import React from 'react';

import Link from '@atlaskit/link';
import { Box, Stack } from '@atlaskit/primitives';

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
						<h3>{name}</h3>
					</Box>
					{content}
				</React.Fragment>
			))}
		</Stack>
	);
};

export default ContentTable;
