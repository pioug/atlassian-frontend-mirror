/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { cssMap } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { jsx } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Heading from '@atlaskit/heading';
import ImageIcon from '@atlaskit/icon/core/image';
import Lozenge, { type NewLozengeColor, type SemanticColor } from '@atlaskit/lozenge';
import LozengeDropdownTrigger from '@atlaskit/lozenge/lozenge-dropdown-trigger';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
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
	stackGroup: {
		display: 'flex',
		gap: token('space.100'),
		flexWrap: 'wrap',
		alignItems: 'flex-start',
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
	const semanticColors: SemanticColor[] = [
		'success',
		'warning',
		'danger',
		'information',
		'discovery',
		'neutral',
	];

	const accentColors: NewLozengeColor[] = [
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
	const [isLoadingTrigger, setIsLoadingTrigger] = useState(false);
	const [isSpaciousTrigger, setIsSpaciousTrigger] = useState(false);
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
					{semanticColors.map((color: SemanticColor) => (
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
								<LozengeDropdownTrigger
									appearance={color}
									trailingMetric="3"
									testId={`semantic-${color}-metric`}
								>
									{color}
								</LozengeDropdownTrigger>
								<LozengeDropdownTrigger
									appearance={color}
									spacing="spacious"
									testId={`semantic-${color}-spacious`}
								>
									{color}
								</LozengeDropdownTrigger>
								<LozengeDropdownTrigger
									appearance={color}
									spacing="spacious"
									trailingMetric="3"
									testId={`semantic-${color}-spacious-metric`}
								>
									{color}
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
								<LozengeDropdownTrigger
									appearance={color}
									spacing="spacious"
									testId={`accent-${color}-spacious`}
								>
									{color}
								</LozengeDropdownTrigger>
							</Box>
						</Box>
					))}
				</Box>
			</Box>

			<Box>
				<Heading size="medium">Spacing</Heading>
				<Text>Default vs spacious spacing variants.</Text>
				<Box xcss={styles.group}>
					<LozengeDropdownTrigger appearance="information">default</LozengeDropdownTrigger>
					<LozengeDropdownTrigger appearance="information" spacing="spacious">
						spacious
					</LozengeDropdownTrigger>
					<LozengeDropdownTrigger appearance="success" spacing="spacious" trailingMetric="3">
						spacious w/ metric
					</LozengeDropdownTrigger>
					<LozengeDropdownTrigger
						appearance="success"
						spacing="spacious"
						trailingMetric="12"
						iconBefore={ImageIcon}
					>
						spacious w/ icon + metric
					</LozengeDropdownTrigger>
				</Box>
			</Box>

			<Box>
				<Heading size="medium">Status switcher</Heading>
				<Text>
					A practical example using LozengeDropdownTrigger with DropdownMenu to create a status
					switcher. Click the lozenge to change the current status.
				</Text>
				<Stack xcss={styles.stackGroup}>
					<Inline space="space.100">
						<Button onClick={() => setIsLoadingTrigger((prev) => !prev)}>
							{isLoadingTrigger ? 'Hide loading' : 'Show loading'}
						</Button>
						<Button onClick={() => setIsSpaciousTrigger((prev) => !prev)}>
							{isSpaciousTrigger ? 'Show default' : 'Show spacious'}
						</Button>
					</Inline>
					<DropdownMenu
						trigger={({ triggerRef, ...props }) => (
							<LozengeDropdownTrigger
								ref={triggerRef}
								isLoading={isLoadingTrigger}
								appearance={currentStatus}
								isSelected={isDropdownOpen}
								onClick={() => setIsDropdownOpen(!isDropdownOpen)}
								iconBefore={ImageIcon}
								spacing={isSpaciousTrigger ? 'spacious' : 'default'}
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
				</Stack>
			</Box>

			<Box>
				<Heading size="medium">Selected</Heading>
				<Text>
					Dropdown trigger lozenges with selected state. Pressed background/icon/border colors are
					applied.
				</Text>
				<Box xcss={styles.group}>
					<LozengeDropdownTrigger appearance="success" isSelected iconBefore={ImageIcon}>
						success
					</LozengeDropdownTrigger>
					<LozengeDropdownTrigger appearance="information" isSelected iconBefore={ImageIcon}>
						information
					</LozengeDropdownTrigger>
					<LozengeDropdownTrigger appearance="danger" isSelected iconBefore={ImageIcon}>
						danger
					</LozengeDropdownTrigger>
					<LozengeDropdownTrigger appearance="warning" isSelected iconBefore={ImageIcon}>
						warning
					</LozengeDropdownTrigger>
					<LozengeDropdownTrigger appearance="discovery" isSelected iconBefore={ImageIcon}>
						discovery
					</LozengeDropdownTrigger>
					<LozengeDropdownTrigger appearance="neutral" isSelected iconBefore={ImageIcon}>
						neutral
					</LozengeDropdownTrigger>
				</Box>
			</Box>

			<Box>
				<Heading size="medium">Spacing</Heading>
				<Text>Default vs spacious spacing variants.</Text>
				<Box xcss={styles.group}>
					<LozengeDropdownTrigger appearance="information">default</LozengeDropdownTrigger>
					<LozengeDropdownTrigger appearance="information" spacing="spacious">
						spacious
					</LozengeDropdownTrigger>
					<LozengeDropdownTrigger
						appearance="information"
						spacing="spacious"
						iconBefore={ImageIcon}
					>
						spacious w/ icon
					</LozengeDropdownTrigger>
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
