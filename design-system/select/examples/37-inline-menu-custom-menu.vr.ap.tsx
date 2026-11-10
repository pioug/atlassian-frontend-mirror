import React from 'react';

import { Box } from '@atlaskit/primitives/compiled/box';
import { Text } from '@atlaskit/primitives/compiled/text';
import Select from '@atlaskit/select/default';
import type { MenuProps, OptionType } from '@atlaskit/select/types';

import { cities } from './common/data';

const MenuWithHeader = ({ children, innerRef, innerProps }: MenuProps<OptionType, boolean>) => (
	<div ref={innerRef} {...innerProps}>
		<Box padding="space.100">
			<Text weight="bold">Recent cities</Text>
		</Box>
		{children}
	</div>
);

/**
 * An always-open inline Select with a custom `components.Menu`. Inline mode keeps the custom
 * Menu, so the header shows above the options.
 */
const InlineMenuCustomMenuExample = (): React.JSX.Element => (
	<Select
		label="City"
		menuRenderMode="inline"
		components={{ Menu: MenuWithHeader }}
		options={cities}
	/>
);

export default InlineMenuCustomMenuExample;
