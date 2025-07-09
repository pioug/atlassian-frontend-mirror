import React from 'react';

import Button, { IconButton } from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import AddIcon from '@atlaskit/icon/core/add';
import EditIcon from '@atlaskit/icon/core/edit';
import EpicIcon from '@atlaskit/icon/core/epic';
import FiltersIcon from '@atlaskit/icon/core/filter';
import MergeSuccessIcon from '@atlaskit/icon/core/merge-success';
import StatusWarningIcon from '@atlaskit/icon/core/status-warning';
import { Inline, Stack, Text } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const IconLabelExample = () => {
	return (
		<Inline space="space.1000">
			<Stack space="space.200" alignBlock="center">
				<Heading size="small">Icons with labels:</Heading>
				<Inline space="space.100" alignBlock="center">
					<EpicIcon color={token('color.icon.accent.purple')} label="Issue type: Epic" />
					<Text weight="bold">Beta release</Text>
				</Inline>
				<Inline space="space.100" alignBlock="center">
					<StatusWarningIcon color={token('color.icon.warning')} label="warning" />
					<Text weight="bold" color="color.text.warning">
						Saving was interrupted
					</Text>
				</Inline>
				<IconButton label="Add" icon={AddIcon} />
			</Stack>
			<Stack space="space.200" alignBlock="center">
				<Heading size="small">Icons without labels:</Heading>
				<Inline space="space.100" alignBlock="center">
					<EditIcon color={token('color.text')} label="" />
					<Text color="color.text">Last edited: yesterday</Text>
				</Inline>
				<Inline space="space.100" alignBlock="center">
					<MergeSuccessIcon color={token('color.text.success')} label="" />
					<Text color="color.text.success">Merged</Text>
				</Inline>
				<Button iconBefore={FiltersIcon}>Filters</Button>
			</Stack>
		</Inline>
	);
};

export default IconLabelExample;
