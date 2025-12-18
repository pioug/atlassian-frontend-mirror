import React from 'react';

import Button, { IconButton } from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import ChevronDown from '@atlaskit/icon/core/chevron-down';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, Stack } from '@atlaskit/primitives';

// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import { SplitButtonWithSlots } from '../src/new-button/containers/split-button';

export default (): React.JSX.Element => (
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
