/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { cssMap } from '@compiled/react';

import { jsx } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Heading from '@atlaskit/heading';
import ImageIcon from '@atlaskit/icon/core/image';
import Lozenge, {
	LozengeDropdownTrigger,
	type LozengeDropdownTriggerProps,
	type NewLozengeColor,
} from '@atlaskit/lozenge';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.200'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
	section: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.100'),
	},
	group: {
		display: 'flex',
		gap: token('space.100'),
		flexWrap: 'wrap',
		alignItems: 'center',
	},
	label: {
		font: token('font.body'),
		color: token('color.text.subtlest'),
		marginBlockEnd: token('space.050'),
	},
});

/**
 * Example showcasing the LozengeDropdownTrigger component with semantic and accent colors.
 *
 * This component combines the visual design of the lozenge with dropdown interaction patterns,
 * including a chevron icon and selected state support.
 */
export default function LozengeDropdownTriggerExample() {
	const semanticColors: LozengeDropdownTriggerProps['appearance'][] = [
		'success',
		'warning',
		'danger',
		'information',
		'discovery',
		'neutral',
	];

	const accentColors: LozengeDropdownTriggerProps['appearance'][] = [
		'accent-red',
		'accent-orange',
		'accent-yellow',
		'accent-lime',
		'accent-green',
		'accent-teal',
		'accent-blue',
		'accent-purple',
		'accent-magenta',
		'accent-gray',
	];

	// Status switcher state
	const [currentStatus, setCurrentStatus] = useState<NewLozengeColor>('success');
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const statusOptions: { label: string; value: NewLozengeColor }[] = [
		{ label: 'Success', value: 'success' },
		{ label: 'Warning', value: 'warning' },
		{ label: 'Danger', value: 'danger' },
		{ label: 'Information', value: 'information' },
		{ label: 'Discovery', value: 'discovery' },
		{ label: 'Neutral', value: 'neutral' },
	];

	return (
		<Box xcss={styles.container}>
			<Text>
				Enable the <code>platform-dst-lozenge-tag-badge-visual-uplifts</code> feature flag to see
				the new lozenge component.
			</Text>
			<Box>
				<Heading size="medium">Semantic colors</Heading>
				<Text>Dropdown trigger lozenges with semantic colors. Click to toggle selected state.</Text>
				<Box xcss={styles.section}>
					{semanticColors.map((color) => (
						<Box key={color}>
							<Box xcss={styles.label}>{color}</Box>
							<Box xcss={styles.group}>
								<LozengeDropdownTrigger appearance={color} testId={`semantic-${color}`}>
									{color}
								</LozengeDropdownTrigger>
								<LozengeDropdownTrigger
									appearance={color}
									iconBefore={ImageIcon}
									testId={`semantic-${color}-icon`}
								>
									With icon
								</LozengeDropdownTrigger>
							</Box>
						</Box>
					))}
				</Box>
			</Box>

			<Box>
				<Heading size="medium">Accent colors</Heading>
				<Text>Dropdown trigger lozenges with accent colors.</Text>
				<Box xcss={styles.section}>
					{accentColors.map((color) => (
						<Box key={color}>
							<Box xcss={styles.label}>{color}</Box>
							<Box xcss={styles.group}>
								<LozengeDropdownTrigger appearance={color} testId={`accent-${color}`}>
									{color}
								</LozengeDropdownTrigger>
								<LozengeDropdownTrigger
									appearance={color}
									iconBefore={ImageIcon}
									testId={`accent-${color}-icon`}
								>
									With icon
								</LozengeDropdownTrigger>
							</Box>
						</Box>
					))}
				</Box>
			</Box>

			<Box>
				<Heading size="medium">Selected</Heading>
				<Box xcss={styles.group}>
					<LozengeDropdownTrigger appearance="accent-blue" isSelected testId={`accent-blue}`}>
						Selected
					</LozengeDropdownTrigger>
					<LozengeDropdownTrigger appearance="accent-blue" isSelected iconBefore={ImageIcon}>
						Selected with icon
					</LozengeDropdownTrigger>
				</Box>
			</Box>

			<Box>
				<Heading size="medium">Status switcher</Heading>
				<Text>
					A practical example using LozengeDropdownTrigger with DropdownMenu to create a status
					switcher. Click the lozenge to change the current status.
				</Text>
				<Box xcss={styles.group}>
					<DropdownMenu
						trigger={({ triggerRef, ...props }) => (
							<LozengeDropdownTrigger
								ref={triggerRef}
								appearance={currentStatus}
								isSelected={isDropdownOpen}
								onClick={() => setIsDropdownOpen(!isDropdownOpen)}
								iconBefore={ImageIcon}
								{...props}
							>
								{statusOptions.find((opt) => opt.value === currentStatus)?.label}
							</LozengeDropdownTrigger>
						)}
						onOpenChange={(isDropdownOpen) => setIsDropdownOpen(!isDropdownOpen)}
					>
						<DropdownItemGroup>
							{statusOptions.map((option) => (
								<DropdownItem key={option.value} onClick={() => setCurrentStatus(option.value)}>
									<Lozenge appearance={option.value} iconBefore={ImageIcon}>
										{option.label}
									</Lozenge>
								</DropdownItem>
							))}
						</DropdownItemGroup>
					</DropdownMenu>
				</Box>
			</Box>

			<Box>
				<Heading size="medium">With max width</Heading>
				<Text>Dropdown trigger lozenges with constrained max-width showing text truncation.</Text>
				<Box xcss={styles.group}>
					<LozengeDropdownTrigger appearance="success" maxWidth={100}>
						This is a very long label
					</LozengeDropdownTrigger>
					<LozengeDropdownTrigger appearance="danger" maxWidth={80}>
						Another long label
					</LozengeDropdownTrigger>
				</Box>
			</Box>
		</Box>
	);
}
