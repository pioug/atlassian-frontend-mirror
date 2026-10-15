import React from 'react';

import Button from '@atlaskit/button/default/button';
import IconButton from '@atlaskit/button/icon/button';
import SplitButtonWithSlots from '@atlaskit/button/split-button-with-slots';
import { SplitButton } from '@atlaskit/button/split-button/split-button';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Stack } from '@atlaskit/primitives/compiled/stack';

/**
 * Primary SplitButton selected-state treatment and unchanged controls.
 */
export default function SplitButtonFinesseExample(): React.JSX.Element {
	return (
		<Box padding="space.200">
			<Stack space="space.200" alignInline="start">
				<SplitButton appearance="primary">
					<Button>Update</Button>
					<IconButton icon={ChevronDownIcon} label="Closed update options" />
				</SplitButton>
				<SplitButton appearance="primary">
					<Button>Update</Button>
					<IconButton
						icon={ChevronDownIcon}
						label="Selected update options"
						isSelected
						testId="selected-primary-trigger"
					/>
				</SplitButton>
				<SplitButton appearance="primary" spacing="compact">
					<Button>Compact update</Button>
					<IconButton icon={ChevronDownIcon} label="Compact update options" isSelected />
				</SplitButton>
				<SplitButton appearance="primary" isDisabled>
					<Button>Disabled update</Button>
					<IconButton icon={ChevronDownIcon} label="Disabled update options" isSelected />
				</SplitButton>
				<SplitButtonWithSlots
					appearance="primary"
					primaryAction={<Button>Update with slots</Button>}
					secondaryAction={
						<IconButton icon={ChevronDownIcon} label="Update options with slots" isSelected />
					}
				/>
				<SplitButton>
					<Button>Default update</Button>
					<IconButton icon={ChevronDownIcon} label="Default update options" isSelected />
				</SplitButton>
				<Button appearance="primary" isSelected>
					Standalone selected primary action
				</Button>
			</Stack>
		</Box>
	);
}
