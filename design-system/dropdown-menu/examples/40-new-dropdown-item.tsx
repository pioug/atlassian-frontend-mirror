import React, { Fragment } from 'react';

import { cssMap } from '@atlaskit/css';
import { DropdownItemCheckbox } from '@atlaskit/dropdown-menu/dropdown-item-checkbox';
import { DropdownItemRadio } from '@atlaskit/dropdown-menu/dropdown-item-radio';
import { DropdownItem as NewDropdownMenuItem } from '@atlaskit/dropdown-menu/dropdown-menu-item';
import Heading from '@atlaskit/heading/heading';
import EmojiIcon from '@atlaskit/icon/core/emoji';
import Lozenge from '@atlaskit/lozenge/lozenge';
import MenuGroup from '@atlaskit/menu/menu-group';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { token } from '@atlaskit/tokens';

// oxlint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import { DropdownTriggerContext } from '../src/internal/context/dropdown-trigger-context';

const styles = cssMap({
	container: {
		width: '500px',
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
});

const loremText =
	'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates incidunt nisi, esse ullam fugit omnis libero neque facilis magnam quaerat dolor iste consequuntur placeat, rerum numquam, eum tempora! Accusamus, quidem?';

const NewDropdownMenuItemExample = (): JSX.Element => (
	<Stack space="space.050" xcss={styles.container}>
		<Heading size="medium">Button</Heading>
		<MenuGroup>
			<NewDropdownMenuItem shortcut={['Ctrl', ']']}>No icon</NewDropdownMenuItem>
			<NewDropdownMenuItem description="Description" shortcut={['Ctrl', ']']}>
				No icon
			</NewDropdownMenuItem>
			<NewDropdownMenuItem elemBefore={<EmojiIcon label="" />} shortcut={['Ctrl', ']']}>
				With elemBefore
			</NewDropdownMenuItem>
			<NewDropdownMenuItem
				description="Description"
				elemBefore={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
			>
				With elemBefore
			</NewDropdownMenuItem>
			<NewDropdownMenuItem elemAfter={<EmojiIcon label="" />} shortcut={['Ctrl', ']']}>
				With elemAfter
			</NewDropdownMenuItem>
			<NewDropdownMenuItem
				description="Description"
				elemAfter={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
			>
				With elemAfter
			</NewDropdownMenuItem>
			<NewDropdownMenuItem
				elemBefore={<EmojiIcon label="" />}
				elemAfter={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
			>
				With elemBefore and elemAfter
			</NewDropdownMenuItem>
			<NewDropdownMenuItem
				description="Description"
				elemBefore={<EmojiIcon label="" />}
				elemAfter={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
			>
				With elemBefore and elemAfter
			</NewDropdownMenuItem>
		</MenuGroup>
		<Heading size="small">Compact</Heading>
		<MenuGroup spacing="compact">
			<NewDropdownMenuItem shortcut={['Ctrl', ']']}>No icon</NewDropdownMenuItem>
			<NewDropdownMenuItem description="Description" shortcut={['Ctrl', ']']}>
				No icon
			</NewDropdownMenuItem>
			<NewDropdownMenuItem elemBefore={<EmojiIcon label="" />} shortcut={['Ctrl', ']']}>
				With elemBefore
			</NewDropdownMenuItem>
			<NewDropdownMenuItem
				description="Description"
				elemBefore={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
			>
				With elemBefore
			</NewDropdownMenuItem>
			<NewDropdownMenuItem elemAfter={<EmojiIcon label="" />} shortcut={['Ctrl', ']']}>
				With elemAfter
			</NewDropdownMenuItem>
			<NewDropdownMenuItem
				description="Description"
				elemAfter={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
			>
				With elemAfter
			</NewDropdownMenuItem>
			<NewDropdownMenuItem
				elemBefore={<EmojiIcon label="" />}
				elemAfter={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
			>
				With elemBefore and elemAfter
			</NewDropdownMenuItem>
			<NewDropdownMenuItem
				description="Description"
				elemBefore={<EmojiIcon label="" />}
				elemAfter={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
			>
				With elemBefore and elemAfter
			</NewDropdownMenuItem>
		</MenuGroup>
		<Heading size="small">Selected</Heading>
		<NewDropdownMenuItem isSelected>No icon</NewDropdownMenuItem>
		<NewDropdownMenuItem description="Description" isSelected>
			No icon
		</NewDropdownMenuItem>
		<NewDropdownMenuItem elemBefore={<EmojiIcon label="" />} isSelected>
			With elemBefore
		</NewDropdownMenuItem>
		<NewDropdownMenuItem description="Description" elemBefore={<EmojiIcon label="" />} isSelected>
			With elemBefore
		</NewDropdownMenuItem>
		<NewDropdownMenuItem elemAfter={<EmojiIcon label="" />} isSelected>
			With elemAfter
		</NewDropdownMenuItem>
		<NewDropdownMenuItem description="Description" elemAfter={<EmojiIcon label="" />} isSelected>
			With elemAfter
		</NewDropdownMenuItem>
		<NewDropdownMenuItem
			elemBefore={<EmojiIcon label="" />}
			elemAfter={<EmojiIcon label="" />}
			isSelected
		>
			With elemBefore and elemAfter
		</NewDropdownMenuItem>
		<NewDropdownMenuItem
			description="Description"
			elemBefore={<EmojiIcon label="" />}
			elemAfter={<EmojiIcon label="" />}
			isSelected
		>
			With elemBefore and elemAfter
		</NewDropdownMenuItem>
		<Heading size="small">Disabled</Heading>
		<NewDropdownMenuItem isDisabled>No icon</NewDropdownMenuItem>
		<NewDropdownMenuItem description="Description" isDisabled>
			No icon
		</NewDropdownMenuItem>
		<NewDropdownMenuItem elemBefore={<EmojiIcon label="" />} isDisabled>
			With elemBefore
		</NewDropdownMenuItem>
		<NewDropdownMenuItem description="Description" elemBefore={<EmojiIcon label="" />} isDisabled>
			With elemBefore
		</NewDropdownMenuItem>
		<NewDropdownMenuItem elemAfter={<EmojiIcon label="" />} isDisabled>
			With elemAfter
		</NewDropdownMenuItem>
		<NewDropdownMenuItem description="Description" elemAfter={<EmojiIcon label="" />} isDisabled>
			With elemAfter
		</NewDropdownMenuItem>
		<NewDropdownMenuItem
			elemBefore={<EmojiIcon label="" />}
			elemAfter={<EmojiIcon label="" />}
			isDisabled
		>
			With elemBefore and elemAfter
		</NewDropdownMenuItem>
		<NewDropdownMenuItem
			description="Description"
			elemBefore={<EmojiIcon label="" />}
			elemAfter={<EmojiIcon label="" />}
			isDisabled
		>
			With elemBefore and elemAfter
		</NewDropdownMenuItem>
		<NewDropdownMenuItem
			elemBefore={<EmojiIcon label="" />}
			elemAfter={<EmojiIcon label="" />}
			isSelected
			isDisabled
		>
			Selected and disabled?
		</NewDropdownMenuItem>
		<Heading size="small">Danger</Heading>
		<NewDropdownMenuItem appearance="danger">No icon</NewDropdownMenuItem>
		<NewDropdownMenuItem description="Description" appearance="danger">
			No icon
		</NewDropdownMenuItem>
		<NewDropdownMenuItem elemBefore={<EmojiIcon label="" />} appearance="danger">
			With elemBefore
		</NewDropdownMenuItem>
		<NewDropdownMenuItem
			description="Description"
			elemBefore={<EmojiIcon label="" />}
			appearance="danger"
		>
			With elemBefore
		</NewDropdownMenuItem>
		<NewDropdownMenuItem elemAfter={<EmojiIcon label="" />} appearance="danger">
			With elemAfter
		</NewDropdownMenuItem>
		<NewDropdownMenuItem
			description="Description"
			elemAfter={<EmojiIcon label="" />}
			appearance="danger"
		>
			With elemAfter
		</NewDropdownMenuItem>
		<NewDropdownMenuItem
			elemBefore={<EmojiIcon label="" />}
			elemAfter={<EmojiIcon label="" />}
			appearance="danger"
		>
			With elemBefore and elemAfter
		</NewDropdownMenuItem>
		<NewDropdownMenuItem
			description="Description"
			elemBefore={<EmojiIcon label="" />}
			elemAfter={<EmojiIcon label="" />}
			appearance="danger"
		>
			With elemBefore and elemAfter
		</NewDropdownMenuItem>
		<Heading size="small">With nested menu</Heading>
		<DropdownTriggerContext.Provider value={true}>
			<NewDropdownMenuItem shortcut={['Ctrl', ']']}>No icon</NewDropdownMenuItem>
			<NewDropdownMenuItem description="Description" shortcut={['Ctrl', ']']}>
				No icon
			</NewDropdownMenuItem>
			<NewDropdownMenuItem elemBefore={<EmojiIcon label="" />} shortcut={['Ctrl', ']']}>
				With elemBefore
			</NewDropdownMenuItem>
			<NewDropdownMenuItem
				description="Description"
				elemBefore={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
			>
				With elemBefore
			</NewDropdownMenuItem>
			<NewDropdownMenuItem elemAfter={<EmojiIcon label="" />} shortcut={['Ctrl', ']']}>
				With elemAfter
			</NewDropdownMenuItem>
			<NewDropdownMenuItem
				description="Description"
				elemAfter={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
			>
				With elemAfter
			</NewDropdownMenuItem>
			<NewDropdownMenuItem
				elemBefore={<EmojiIcon label="" />}
				elemAfter={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
			>
				With elemBefore and elemAfter
			</NewDropdownMenuItem>
			<NewDropdownMenuItem
				description="Description"
				elemBefore={<EmojiIcon label="" />}
				elemAfter={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
			>
				With elemBefore and elemAfter
			</NewDropdownMenuItem>
			<Heading size="small">With nested menu - selected</Heading>
			<NewDropdownMenuItem shortcut={['Ctrl', ']']} isSelected>
				No icon
			</NewDropdownMenuItem>
			<NewDropdownMenuItem description="Description" shortcut={['Ctrl', ']']} isSelected>
				No icon
			</NewDropdownMenuItem>
			<NewDropdownMenuItem elemBefore={<EmojiIcon label="" />} shortcut={['Ctrl', ']']} isSelected>
				With elemBefore
			</NewDropdownMenuItem>
			<NewDropdownMenuItem
				description="Description"
				elemBefore={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
				isSelected
			>
				With elemBefore
			</NewDropdownMenuItem>
			<NewDropdownMenuItem elemAfter={<EmojiIcon label="" />} shortcut={['Ctrl', ']']} isSelected>
				With elemAfter
			</NewDropdownMenuItem>
			<NewDropdownMenuItem
				description="Description"
				elemAfter={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
				isSelected
			>
				With elemAfter
			</NewDropdownMenuItem>
			<NewDropdownMenuItem
				elemBefore={<EmojiIcon label="" />}
				elemAfter={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
				isSelected
			>
				With elemBefore and elemAfter
			</NewDropdownMenuItem>
			<NewDropdownMenuItem
				description="Description"
				elemBefore={<EmojiIcon label="" />}
				elemAfter={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
				isSelected
			>
				With elemBefore and elemAfter
			</NewDropdownMenuItem>
		</DropdownTriggerContext.Provider>
		<Heading size="small">Truncation & wrapping</Heading>
		<NewDropdownMenuItem
			description={loremText}
			elemBefore={<EmojiIcon label="" />}
			elemAfter={<EmojiIcon label="" />}
			shouldTitleWrap={false}
			shouldDescriptionWrap={false}
		>
			Truncated with description - {loremText}
		</NewDropdownMenuItem>
		<NewDropdownMenuItem
			description={loremText}
			elemBefore={<EmojiIcon label="" />}
			elemAfter={<EmojiIcon label="" />}
			shouldTitleWrap
			shouldDescriptionWrap
		>
			Wrapped with description - {loremText}
		</NewDropdownMenuItem>
		<NewDropdownMenuItem
			shouldTitleWrap
			elemBefore={<EmojiIcon label="" />}
			elemAfter={<EmojiIcon label="" />}
		>
			<Fragment>
				With elemBefore and elemAfter long title something something something{' '}
				<Lozenge appearance="discovery">New</Lozenge>
			</Fragment>
		</NewDropdownMenuItem>
		<Heading size="medium">Link</Heading>
		<NewDropdownMenuItem href="#">No icon</NewDropdownMenuItem>
		<NewDropdownMenuItem description="Description" href="#">
			No icon
		</NewDropdownMenuItem>
		<NewDropdownMenuItem elemBefore={<EmojiIcon label="" />} href="#">
			With elemBefore
		</NewDropdownMenuItem>
		<NewDropdownMenuItem description="Description" elemBefore={<EmojiIcon label="" />} href="#">
			With elemBefore
		</NewDropdownMenuItem>
		<NewDropdownMenuItem elemAfter={<EmojiIcon label="" />} href="#">
			With elemAfter
		</NewDropdownMenuItem>
		<NewDropdownMenuItem description="Description" elemAfter={<EmojiIcon label="" />} href="#">
			With elemAfter
		</NewDropdownMenuItem>
		<NewDropdownMenuItem
			elemBefore={<EmojiIcon label="" />}
			elemAfter={<EmojiIcon label="" />}
			href="#"
		>
			With elemBefore and elemAfter
		</NewDropdownMenuItem>
		<NewDropdownMenuItem
			description="Description"
			elemBefore={<EmojiIcon label="" />}
			elemAfter={<EmojiIcon label="" />}
			href="#"
		>
			With elemBefore and elemAfter
		</NewDropdownMenuItem>
		<Heading size="small">Selected</Heading>
		<NewDropdownMenuItem href="#" isSelected>
			No icon
		</NewDropdownMenuItem>
		<NewDropdownMenuItem description="Description" href="#" isSelected>
			No icon
		</NewDropdownMenuItem>
		<NewDropdownMenuItem elemBefore={<EmojiIcon label="" />} href="#" isSelected>
			With elemBefore
		</NewDropdownMenuItem>
		<NewDropdownMenuItem
			description="Description"
			elemBefore={<EmojiIcon label="" />}
			href="#"
			isSelected
		>
			With elemBefore
		</NewDropdownMenuItem>
		<NewDropdownMenuItem elemAfter={<EmojiIcon label="" />} href="#" isSelected>
			With elemAfter
		</NewDropdownMenuItem>
		<NewDropdownMenuItem
			description="Description"
			elemAfter={<EmojiIcon label="" />}
			href="#"
			isSelected
		>
			With elemAfter
		</NewDropdownMenuItem>
		<NewDropdownMenuItem
			elemBefore={<EmojiIcon label="" />}
			elemAfter={<EmojiIcon label="" />}
			href="#"
			isSelected
		>
			With elemBefore and elemAfter
		</NewDropdownMenuItem>
		<NewDropdownMenuItem
			description="Description"
			elemBefore={<EmojiIcon label="" />}
			elemAfter={<EmojiIcon label="" />}
			href="#"
			isSelected
		>
			With elemBefore and elemAfter
		</NewDropdownMenuItem>

		<Heading size="medium">Checkbox</Heading>

		<DropdownItemCheckbox id="checkbox-1">No icon</DropdownItemCheckbox>
		<DropdownItemCheckbox id="checkbox-2" description="Description">
			No icon
		</DropdownItemCheckbox>
		<DropdownItemCheckbox id="checkbox-3" description="Description" shortcut={['Ctrl', ']']}>
			With shortcut
		</DropdownItemCheckbox>
		<DropdownItemCheckbox
			id="checkbox-4"
			description="Description"
			shortcut={['Ctrl', ']']}
			isDisabled
		>
			Disabled
		</DropdownItemCheckbox>
		<DropdownItemCheckbox
			id="checkbox-5"
			description="Description"
			shortcut={['Ctrl', ']']}
			isSelected
			isDisabled
		>
			Disabled and selected
		</DropdownItemCheckbox>

		<Heading size="medium">Radio</Heading>

		<DropdownItemRadio id="radio-1">No icon</DropdownItemRadio>
		<DropdownItemRadio id="radio-2" description="Description">
			No icon
		</DropdownItemRadio>
		<DropdownItemRadio id="radio-3" description="Description" shortcut={['Ctrl', ']']}>
			With shortcut
		</DropdownItemRadio>
		<DropdownItemRadio id="radio-4" description="Description" shortcut={['Ctrl', ']']} isDisabled>
			Disabled
		</DropdownItemRadio>
		<DropdownItemRadio
			id="radio-5"
			description="Description"
			shortcut={['Ctrl', ']']}
			isSelected
			isDisabled
		>
			Disabled and selected
		</DropdownItemRadio>
	</Stack>
);
export default NewDropdownMenuItemExample;
