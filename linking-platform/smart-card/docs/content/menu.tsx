import React from 'react';

import PageIcon from '@atlaskit/icon/core/page';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Grid, Inline, Pressable, Stack, Text, xcss } from '@atlaskit/primitives';

import { LinkItemGroups } from '../utils/doc-quick-links';

const pressableStyles = xcss({
	borderRadius: '3px',
	borderColor: 'color.border',
	borderWidth: 'border.width',
	borderStyle: 'solid',
	color: 'color.text',
	':hover': {
		backgroundColor: 'color.background.neutral.subtle.hovered',
	},
	':active': {
		backgroundColor: 'color.background.neutral.subtle.pressed',
	},
});

const Menu = () => (
	<Stack space="space.100">
		{LinkItemGroups.map((group, groupIdx) => (
			<Grid
				rowGap="space.100"
				columnGap="space.100"
				key={`group-${groupIdx}`}
				templateColumns={group.items.length === 1 ? '1fr' : '1fr 1fr'}
			>
				{group.items.map((item, itemIdx) => (
					<Pressable
						onClick={item.onClick}
						xcss={pressableStyles}
						backgroundColor="color.background.neutral.subtle"
						padding="space.150"
						key={`item-${groupIdx}-${itemIdx}`}
					>
						<Grid alignItems="center" gap="space.100" templateColumns="1fr 16px">
							<Inline alignBlock="center" space="space.100">
								<Box>{item.elemBefore ?? <PageIcon label="" />}</Box>
								<Stack>
									<Text align="start" weight="semibold">
										{item.name}
									</Text>
									<Text align="start" size="small" color="color.text.subtlest">
										{item.description}
									</Text>
								</Stack>
							</Inline>
							<Box>{item.elemAfter}</Box>
						</Grid>
					</Pressable>
				))}
			</Grid>
		))}
	</Stack>
);

export default Menu;
