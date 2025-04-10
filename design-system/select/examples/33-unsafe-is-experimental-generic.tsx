import React, { useState } from 'react';

import Banner from '@atlaskit/banner';
import Button, { IconButton } from '@atlaskit/button/new';
import { Label } from '@atlaskit/form';
import WarningIcon from '@atlaskit/icon/core/warning';
import EditIcon from '@atlaskit/icon/glyph/edit';
import Lozenge, { LozengeProps } from '@atlaskit/lozenge';
import { Inline, Stack, Text, xcss } from '@atlaskit/primitives';
import Pressable from '@atlaskit/primitives/pressable';
import Select, { components, MenuProps, type OptionProps, type ValueType } from '@atlaskit/select';

interface Option {
	label: string;
	value: string;
	appearance?: LozengeProps['appearance'];
}

const options: Option[] = [
	{ label: 'Blocked', value: 'blocked' },
	{ label: 'Gathering Interest', value: 'gathering' },
	{ label: 'Long-term Backlog', value: 'long-term' },
	{ label: 'To Do', value: 'to-do' },
	{ label: 'Reviewing/ QA Demo', value: 'reviewing', appearance: 'inprogress' },
	{ label: 'Done', value: 'done', appearance: 'success' },
];

const boxStyles = xcss({
	width: '400px',
});

const footerStyles = xcss({
	borderBlockStartWidth: 'border.width',
	borderBlockStartColor: 'color.border',
	borderBlockStartStyle: 'solid',
});

/**
 * NOTE this is not declared inline with the Select
 * If you declare inline you'll have issues with refs
 */
const CustomOption = ({ children, ...props }: OptionProps<Option>) => {
	const appearance = props.data.appearance ? props.data.appearance : 'default';
	return (
		<components.Option {...props}>
			<Inline alignBlock="center" spread="space-between" role="group">
				<Pressable backgroundColor="color.background.neutral.subtle">
					<Lozenge appearance={appearance}>{children}</Lozenge>
				</Pressable>
				<IconButton
					appearance="subtle"
					spacing="compact"
					icon={EditIcon}
					label={`Edit ${children} status`}
				/>
			</Inline>
		</components.Option>
	);
};

const CustomMenu = (props: MenuProps<Option>) => {
	return (
		<components.Menu {...props}>
			<Stack>
				{props.children}
				<Inline xcss={footerStyles}>
					<Button appearance="subtle">Create status</Button>
				</Inline>
			</Stack>
		</components.Menu>
	);
};

export default () => {
	const [value, setValue] = useState<ValueType<Option>>();
	return (
		<Stack space="space.400">
			<Banner>
				<WarningIcon label="" />
				<Text>
					This is a basic test for rendering generic list semantics. Keyboard interaction is not
					provided.
				</Text>
			</Banner>
			<Inline alignInline="center">
				<Stack xcss={boxStyles}>
					<Label htmlFor="status">Status</Label>
					<Select<Option>
						value={value}
						onChange={(val) => setValue(val)}
						inputId="status"
						components={{
							Option: CustomOption,
							Menu: CustomMenu,
						}}
						label="Status"
						menuIsOpen
						options={options}
						isClearable
						clearControlLabel="Clear status"
						UNSAFE_is_experimental_generic
					/>
				</Stack>
			</Inline>
		</Stack>
	);
};
