import React from 'react';

import Heading from '@atlaskit/heading';
import ChevronDown from '@atlaskit/icon/glyph/chevron-down';
import { Box, Inline, Stack } from '@atlaskit/primitives';

import Button, { IconButton } from '../src/new';
import { SplitButtonWithSlots } from '../src/new-button/containers/split-button';

export default () => (
	<Box padding="space.250">
		<Stack space="space.200">
			<Heading size="medium">Visual variants</Heading>
			<Stack space="space.150">
				<Inline space="space.250">
					<SplitButtonWithSlots
						spacing="compact"
						primaryAction={<Button>Split button</Button>}
						secondaryAction={<IconButton icon={ChevronDown} label="Options" />}
					/>
					<SplitButtonWithSlots
						appearance="primary"
						spacing="compact"
						primaryAction={<Button>Split button</Button>}
						secondaryAction={<IconButton icon={ChevronDown} label="Options" />}
					/>
					<SplitButtonWithSlots
						isDisabled
						spacing="compact"
						primaryAction={<Button>Split button</Button>}
						secondaryAction={<IconButton icon={ChevronDown} label="Options" />}
					/>
				</Inline>
				<Inline space="space.150">
					<SplitButtonWithSlots
						primaryAction={<Button>Split button</Button>}
						secondaryAction={<IconButton icon={ChevronDown} label="Options" />}
					/>
					<SplitButtonWithSlots
						appearance="primary"
						primaryAction={<Button>Split button</Button>}
						secondaryAction={<IconButton icon={ChevronDown} label="Options" />}
					/>
					<SplitButtonWithSlots
						isDisabled
						primaryAction={<Button>Split button</Button>}
						secondaryAction={<IconButton icon={ChevronDown} label="Options" />}
					/>
				</Inline>
			</Stack>
		</Stack>
	</Box>
);
