/**
 * @jsxRuntime classic
 * @jsx jsx
 *
 * Examples for TagDropdownTrigger, which is deprecated and intended for Jira Epic only.
 */
import { useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import __noop from '@atlaskit/ds-lib/noop';
import Heading from '@atlaskit/heading';
import StarStarredIcon from '@atlaskit/icon/core/star-starred';
import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';
import Popup from '@atlaskit/popup';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import SectionMessage from '@atlaskit/section-message';
import { type NewTagColor } from '@atlaskit/tag';
import TagDropdownTrigger from '@atlaskit/tag/tag-dropdown-trigger';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	popupMenu: {
		paddingInlineStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockStart: token('space.200'),
		paddingBlockEnd: token('space.200'),
	},
	container: {
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
});

const colors: NewTagColor[] = [
	'blue',
	'green',
	'teal',
	'purple',
	'red',
	'yellow',
	'orange',
	'magenta',
	'lime',
	'gray',
];

const BasicExample = () => (
	<Stack space="space.100">
		<Heading size="xsmall" as="h3">
			Basic dropdown triggers
		</Heading>
		<Text as="p" size="small" color="color.text.subtlest">
			Second: <code>hasChevron={'{false}'}</code>.
		</Text>
		<Inline space="space.100">
			<TagDropdownTrigger text="Default trigger" />
			<TagDropdownTrigger text="No chevron" hasChevron={false} />
		</Inline>
	</Stack>
);

const ColorVariantsExample = () => (
	<Stack space="space.100">
		<Heading size="xsmall" as="h3">
			Color variants
		</Heading>

		<Inline space="space.100" shouldWrap>
			{colors.map((color) => (
				<TagDropdownTrigger key={color} text={color} color={color} />
			))}
		</Inline>
	</Stack>
);

const WithIconExample = () => (
	<Stack space="space.100">
		<Heading size="xsmall" as="h3">
			With icon/avatar
		</Heading>

		<Inline space="space.100">
			<TagDropdownTrigger
				text="Featured"
				onClick={__noop}
				color="red"
				elemBefore={<StarUnstarredIcon label="" size="small" />}
			/>
		</Inline>
	</Stack>
);

const MaxWidthExample = () => (
	<Stack space="space.100">
		<Heading size="xsmall" as="h3">
			Max width (truncation)
		</Heading>
		<Inline space="space.100">
			<TagDropdownTrigger
				text="This is a very long tag text that will be truncated"
				maxWidth={200}
			/>
			<TagDropdownTrigger
				text="Another long tag name that exceeds the max width"
				maxWidth={150}
				color="purple"
			/>
		</Inline>
	</Stack>
);

const SwatchBeforeExample = () => (
	<Stack space="space.100">
		<Heading size="xsmall" as="h3">
			Leading swatch
		</Heading>
		<Text as="p" size="small" color="color.text.subtlest">
			<code>swatchBefore</code>: boolean <code>true</code> uses the tag&apos;s <code>color</code>{' '}
			(accent subtle fill), or pass a token path resolved with <code>token()</code>, e.g.{' '}
			<code>{`swatchBefore={token('color.background.accent.red.subtle')}`}</code>.
		</Text>
		<Inline space="space.100">
			{colors.map((color) => (
				<TagDropdownTrigger key={color} text="Tag" color={color} swatchBefore />
			))}
		</Inline>
		<Inline>
			<TagDropdownTrigger
				text="Custom swatch"
				color="gray"
				swatchBefore={token('color.background.accent.red.subtle')}
			/>
		</Inline>
	</Stack>
);

const CombinedExample = () => {
	const [filterOpen, setFilterOpen] = useState(false);

	return (
		<Stack space="space.100">
			<Heading size="xsmall" as="h3">
				Complete example with popup simulation
			</Heading>
			<Text as="p" size="small" color="color.text.subtlest">
				Spread Popup <code>trigger</code> props; <code>isSelected</code> mirrors open state;{' '}
				<code>swatchBefore</code>, <code>color="blue"</code>, <code>text</code>,{' '}
				<code>aria-haspopup</code>, <code>aria-expanded</code>, <code>aria-controls</code>,{' '}
				<code>onClick</code>.
			</Text>
			<Inline space="space.100">
				<Popup
					shouldRenderToParent
					isOpen={filterOpen}
					onClose={() => setFilterOpen(false)}
					placement="bottom-start"
					content={() => <Box xcss={styles.popupMenu}>Content</Box>}
					trigger={(triggerProps) => (
						<TagDropdownTrigger
							{...triggerProps}
							isSelected={filterOpen}
							text="Epic tag"
							swatchBefore
							color="blue"
							aria-haspopup="menu"
							aria-expanded={filterOpen}
							aria-controls="filter-dropdown"
							onClick={() => setFilterOpen(!filterOpen)}
						/>
					)}
				/>
			</Inline>
		</Stack>
	);
};
const SelectedExample = () => (
	<Stack space="space.100">
		<Heading size="xsmall" as="h3">
			Selected
		</Heading>
		<Text as="p" size="small" color="color.text.subtlest">
			<code>isSelected</code> for the active/selected visual. Shown with <code>color</code> only,
			with <code>swatchBefore</code>, with <code>elemBefore</code>, and with both{' '}
			<code>swatchBefore</code> and <code>elemBefore</code>.
		</Text>
		<Inline space="space.100">
			<TagDropdownTrigger text="Selected" isSelected color="blue" />
			<TagDropdownTrigger text="Selected" swatchBefore isSelected color="red" />
			<TagDropdownTrigger
				text="Selected"
				isSelected
				color="green"
				elemBefore={<StarStarredIcon label="" size="small" />}
			/>
			<TagDropdownTrigger
				text="Selected"
				swatchBefore
				isSelected
				color="purple"
				elemBefore={<StarStarredIcon label="" size="small" />}
			/>
		</Inline>
	</Stack>
);

const LoadingExample = () => {
	const [isLoadingTrigger, setIsLoadingTrigger] = useState(false);
	return (
		<Stack space="space.100">
			<Heading size="xsmall" as="h3">
				Loading
			</Heading>
			<Text as="p" size="small" color="color.text.subtlest">
				<code>isLoading</code> toggles between <code>true</code> and <code>false</code> (with{' '}
				<code>swatchBefore</code> and <code>color="red"</code>).
			</Text>
			<Inline space="space.100">
				<Button onClick={() => setIsLoadingTrigger((prev) => !prev)}>
					{isLoadingTrigger ? 'Hide loading' : 'Show loading'}
				</Button>
			</Inline>
			<Inline space="space.100">
				<TagDropdownTrigger
					text="Selected"
					swatchBefore
					color="red"
					isLoading={isLoadingTrigger}
				/>
			</Inline>
		</Stack>
	);
};
export default (): JSX.Element => (
	<Box xcss={styles.container}>
		<Stack space="space.300">
			<SectionMessage appearance="warning" title="Deprecated — do not use for new work">
				<p>
					<code>TagDropdownTrigger</code> is deprecated and supported only for{' '}
					<strong>Jira Epic</strong>. Do not use it for other products, features, or use cases. The
					examples below exist for Epic-related reference only.
				</p>
			</SectionMessage>
			<Heading size="medium" as="h2">
				TagDropdownTrigger Examples
			</Heading>
			<BasicExample />
			<ColorVariantsExample />
			<CombinedExample />
			<WithIconExample />
			<SwatchBeforeExample />
			<SelectedExample />
			<LoadingExample />
			<MaxWidthExample />
		</Stack>
	</Box>
);
