import React, { Fragment } from 'react';

import { cssMap } from '@atlaskit/css';
import { DropdownItem } from '@atlaskit/dropdown-menu/dropdown-item';
import { DropdownItemCheckbox } from '@atlaskit/dropdown-menu/dropdown-item-checkbox';
import { DropdownItemRadio } from '@atlaskit/dropdown-menu/dropdown-item-radio';
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
			<DropdownItem shortcut={['Ctrl', ']']}>No icon</DropdownItem>
			<DropdownItem description="Description" shortcut={['Ctrl', ']']}>
				No icon
			</DropdownItem>
			<DropdownItem elemBefore={<EmojiIcon label="" />} shortcut={['Ctrl', ']']}>
				With elemBefore
			</DropdownItem>
			<DropdownItem
				description="Description"
				elemBefore={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
			>
				With elemBefore
			</DropdownItem>
			<DropdownItem elemAfter={<EmojiIcon label="" />} shortcut={['Ctrl', ']']}>
				With elemAfter
			</DropdownItem>
			<DropdownItem
				description="Description"
				elemAfter={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
			>
				With elemAfter
			</DropdownItem>
			<DropdownItem
				elemBefore={<EmojiIcon label="" />}
				elemAfter={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
			>
				With elemBefore and elemAfter
			</DropdownItem>
			<DropdownItem
				description="Description"
				elemBefore={<EmojiIcon label="" />}
				elemAfter={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
			>
				With elemBefore and elemAfter
			</DropdownItem>
		</MenuGroup>
		<Heading size="small">Compact</Heading>
		<MenuGroup spacing="compact">
			<DropdownItem shortcut={['Ctrl', ']']}>No icon</DropdownItem>
			<DropdownItem description="Description" shortcut={['Ctrl', ']']}>
				No icon
			</DropdownItem>
			<DropdownItem elemBefore={<EmojiIcon label="" />} shortcut={['Ctrl', ']']}>
				With elemBefore
			</DropdownItem>
			<DropdownItem
				description="Description"
				elemBefore={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
			>
				With elemBefore
			</DropdownItem>
			<DropdownItem elemAfter={<EmojiIcon label="" />} shortcut={['Ctrl', ']']}>
				With elemAfter
			</DropdownItem>
			<DropdownItem
				description="Description"
				elemAfter={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
			>
				With elemAfter
			</DropdownItem>
			<DropdownItem
				elemBefore={<EmojiIcon label="" />}
				elemAfter={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
			>
				With elemBefore and elemAfter
			</DropdownItem>
			<DropdownItem
				description="Description"
				elemBefore={<EmojiIcon label="" />}
				elemAfter={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
			>
				With elemBefore and elemAfter
			</DropdownItem>
		</MenuGroup>
		<Heading size="small">Selected</Heading>
		<DropdownItem isSelected>No icon</DropdownItem>
		<DropdownItem description="Description" isSelected>
			No icon
		</DropdownItem>
		<DropdownItem elemBefore={<EmojiIcon label="" />} isSelected>
			With elemBefore
		</DropdownItem>
		<DropdownItem description="Description" elemBefore={<EmojiIcon label="" />} isSelected>
			With elemBefore
		</DropdownItem>
		<DropdownItem elemAfter={<EmojiIcon label="" />} isSelected>
			With elemAfter
		</DropdownItem>
		<DropdownItem description="Description" elemAfter={<EmojiIcon label="" />} isSelected>
			With elemAfter
		</DropdownItem>
		<DropdownItem elemBefore={<EmojiIcon label="" />} elemAfter={<EmojiIcon label="" />} isSelected>
			With elemBefore and elemAfter
		</DropdownItem>
		<DropdownItem
			description="Description"
			elemBefore={<EmojiIcon label="" />}
			elemAfter={<EmojiIcon label="" />}
			isSelected
		>
			With elemBefore and elemAfter
		</DropdownItem>
		<Heading size="small">Disabled</Heading>
		<DropdownItem isDisabled>No icon</DropdownItem>
		<DropdownItem description="Description" isDisabled>
			No icon
		</DropdownItem>
		<DropdownItem elemBefore={<EmojiIcon label="" />} isDisabled>
			With elemBefore
		</DropdownItem>
		<DropdownItem description="Description" elemBefore={<EmojiIcon label="" />} isDisabled>
			With elemBefore
		</DropdownItem>
		<DropdownItem elemAfter={<EmojiIcon label="" />} isDisabled>
			With elemAfter
		</DropdownItem>
		<DropdownItem description="Description" elemAfter={<EmojiIcon label="" />} isDisabled>
			With elemAfter
		</DropdownItem>
		<DropdownItem elemBefore={<EmojiIcon label="" />} elemAfter={<EmojiIcon label="" />} isDisabled>
			With elemBefore and elemAfter
		</DropdownItem>
		<DropdownItem
			description="Description"
			elemBefore={<EmojiIcon label="" />}
			elemAfter={<EmojiIcon label="" />}
			isDisabled
		>
			With elemBefore and elemAfter
		</DropdownItem>
		<DropdownItem
			elemBefore={<EmojiIcon label="" />}
			elemAfter={<EmojiIcon label="" />}
			isSelected
			isDisabled
		>
			Selected and disabled?
		</DropdownItem>
		<Heading size="small">Danger</Heading>
		<DropdownItem appearance="danger">No icon</DropdownItem>
		<DropdownItem description="Description" appearance="danger">
			No icon
		</DropdownItem>
		<DropdownItem elemBefore={<EmojiIcon label="" />} appearance="danger">
			With elemBefore
		</DropdownItem>
		<DropdownItem description="Description" elemBefore={<EmojiIcon label="" />} appearance="danger">
			With elemBefore
		</DropdownItem>
		<DropdownItem elemAfter={<EmojiIcon label="" />} appearance="danger">
			With elemAfter
		</DropdownItem>
		<DropdownItem description="Description" elemAfter={<EmojiIcon label="" />} appearance="danger">
			With elemAfter
		</DropdownItem>
		<DropdownItem
			elemBefore={<EmojiIcon label="" />}
			elemAfter={<EmojiIcon label="" />}
			appearance="danger"
		>
			With elemBefore and elemAfter
		</DropdownItem>
		<DropdownItem
			description="Description"
			elemBefore={<EmojiIcon label="" />}
			elemAfter={<EmojiIcon label="" />}
			appearance="danger"
		>
			With elemBefore and elemAfter
		</DropdownItem>
		<Heading size="small">With nested menu</Heading>
		<DropdownTriggerContext.Provider value={true}>
			<DropdownItem shortcut={['Ctrl', ']']}>No icon</DropdownItem>
			<DropdownItem description="Description" shortcut={['Ctrl', ']']}>
				No icon
			</DropdownItem>
			<DropdownItem elemBefore={<EmojiIcon label="" />} shortcut={['Ctrl', ']']}>
				With elemBefore
			</DropdownItem>
			<DropdownItem
				description="Description"
				elemBefore={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
			>
				With elemBefore
			</DropdownItem>
			<DropdownItem elemAfter={<EmojiIcon label="" />} shortcut={['Ctrl', ']']}>
				With elemAfter
			</DropdownItem>
			<DropdownItem
				description="Description"
				elemAfter={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
			>
				With elemAfter
			</DropdownItem>
			<DropdownItem
				elemBefore={<EmojiIcon label="" />}
				elemAfter={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
			>
				With elemBefore and elemAfter
			</DropdownItem>
			<DropdownItem
				description="Description"
				elemBefore={<EmojiIcon label="" />}
				elemAfter={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
			>
				With elemBefore and elemAfter
			</DropdownItem>
			<Heading size="small">With nested menu - selected</Heading>
			<DropdownItem shortcut={['Ctrl', ']']} isSelected>
				No icon
			</DropdownItem>
			<DropdownItem description="Description" shortcut={['Ctrl', ']']} isSelected>
				No icon
			</DropdownItem>
			<DropdownItem elemBefore={<EmojiIcon label="" />} shortcut={['Ctrl', ']']} isSelected>
				With elemBefore
			</DropdownItem>
			<DropdownItem
				description="Description"
				elemBefore={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
				isSelected
			>
				With elemBefore
			</DropdownItem>
			<DropdownItem elemAfter={<EmojiIcon label="" />} shortcut={['Ctrl', ']']} isSelected>
				With elemAfter
			</DropdownItem>
			<DropdownItem
				description="Description"
				elemAfter={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
				isSelected
			>
				With elemAfter
			</DropdownItem>
			<DropdownItem
				elemBefore={<EmojiIcon label="" />}
				elemAfter={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
				isSelected
			>
				With elemBefore and elemAfter
			</DropdownItem>
			<DropdownItem
				description="Description"
				elemBefore={<EmojiIcon label="" />}
				elemAfter={<EmojiIcon label="" />}
				shortcut={['Ctrl', ']']}
				isSelected
			>
				With elemBefore and elemAfter
			</DropdownItem>
		</DropdownTriggerContext.Provider>
		<Heading size="small">Truncation & wrapping</Heading>
		<DropdownItem
			description={loremText}
			elemBefore={<EmojiIcon label="" />}
			elemAfter={<EmojiIcon label="" />}
			shouldTitleWrap={false}
			shouldDescriptionWrap={false}
		>
			Truncated with description - {loremText}
		</DropdownItem>
		<DropdownItem
			description={loremText}
			elemBefore={<EmojiIcon label="" />}
			elemAfter={<EmojiIcon label="" />}
			shouldTitleWrap
			shouldDescriptionWrap
		>
			Wrapped with description - {loremText}
		</DropdownItem>
		<DropdownItem
			shouldTitleWrap
			elemBefore={<EmojiIcon label="" />}
			elemAfter={<EmojiIcon label="" />}
		>
			<Fragment>
				With elemBefore and elemAfter long title something something something{' '}
				<Lozenge appearance="discovery">New</Lozenge>
			</Fragment>
		</DropdownItem>
		<Heading size="medium">Link</Heading>
		<DropdownItem href="#">No icon</DropdownItem>
		<DropdownItem description="Description" href="#">
			No icon
		</DropdownItem>
		<DropdownItem elemBefore={<EmojiIcon label="" />} href="#">
			With elemBefore
		</DropdownItem>
		<DropdownItem description="Description" elemBefore={<EmojiIcon label="" />} href="#">
			With elemBefore
		</DropdownItem>
		<DropdownItem elemAfter={<EmojiIcon label="" />} href="#">
			With elemAfter
		</DropdownItem>
		<DropdownItem description="Description" elemAfter={<EmojiIcon label="" />} href="#">
			With elemAfter
		</DropdownItem>
		<DropdownItem elemBefore={<EmojiIcon label="" />} elemAfter={<EmojiIcon label="" />} href="#">
			With elemBefore and elemAfter
		</DropdownItem>
		<DropdownItem
			description="Description"
			elemBefore={<EmojiIcon label="" />}
			elemAfter={<EmojiIcon label="" />}
			href="#"
		>
			With elemBefore and elemAfter
		</DropdownItem>
		<Heading size="small">Selected</Heading>
		<DropdownItem href="#" isSelected>
			No icon
		</DropdownItem>
		<DropdownItem description="Description" href="#" isSelected>
			No icon
		</DropdownItem>
		<DropdownItem elemBefore={<EmojiIcon label="" />} href="#" isSelected>
			With elemBefore
		</DropdownItem>
		<DropdownItem description="Description" elemBefore={<EmojiIcon label="" />} href="#" isSelected>
			With elemBefore
		</DropdownItem>
		<DropdownItem elemAfter={<EmojiIcon label="" />} href="#" isSelected>
			With elemAfter
		</DropdownItem>
		<DropdownItem description="Description" elemAfter={<EmojiIcon label="" />} href="#" isSelected>
			With elemAfter
		</DropdownItem>
		<DropdownItem
			elemBefore={<EmojiIcon label="" />}
			elemAfter={<EmojiIcon label="" />}
			href="#"
			isSelected
		>
			With elemBefore and elemAfter
		</DropdownItem>
		<DropdownItem
			description="Description"
			elemBefore={<EmojiIcon label="" />}
			elemAfter={<EmojiIcon label="" />}
			href="#"
			isSelected
		>
			With elemBefore and elemAfter
		</DropdownItem>

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
