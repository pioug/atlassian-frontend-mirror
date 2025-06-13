import React from 'react';

import Heading from '@atlaskit/heading';
import Story16Icon from '@atlaskit/icon-object/glyph/story/16';
import ComponentIcon from '@atlaskit/icon/core/migration/component';
import EmojiAddIcon from '@atlaskit/icon/core/migration/emoji-add';
import FeedbackIcon from '@atlaskit/icon/core/migration/feedback';
import Lozenge from '@atlaskit/lozenge';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';

export default function Example() {
	return (
		<Box backgroundColor="elevation.surface" padding="space.150">
			<Stack space="space.150">
				<Stack space="space.050">
					<Inline alignBlock="center" space="space.100">
						<Story16Icon label="" />
						<Heading size="small">What we learned reviewing Atlas end to end</Heading>
					</Inline>
					<Inline separator="•" space="space.100">
						<Box>Created by Bradley Rogers</Box>
						<Box>5 hours ago</Box>
						<Box>Atlas</Box>
					</Inline>
				</Stack>
				What did we do? As a team, Atlas just completed our first full round of reviewing our end
				user experience from end to end. We started by identifying 12 top tasks…
				<Inline space="space.050">
					<Lozenge>
						<ComponentIcon label="" />
					</Lozenge>
					<Lozenge>
						<FeedbackIcon label="" />
					</Lozenge>
					<Lozenge>
						<EmojiAddIcon label="" />
					</Lozenge>
				</Inline>
			</Stack>
		</Box>
	);
}
