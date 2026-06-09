/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
import React, { useCallback, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { getFirstFocusable } from '@atlaskit/top-layer/focus';
import { Popover } from '@atlaskit/top-layer/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

import { ForceFallbackToggle } from '../examples-utils/force-fallback-toggle';

const styles = cssMap({
	customPopup: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border.discovery'),
		borderRadius: token('radius.large', '8px'),
		backgroundColor: token('color.background.discovery'),
		maxWidth: '260px',
	},
});

/**
 * `PopoverSurface` is optional - it provides default elevation styling
 * (background, border-radius, box-shadow) via design tokens. When omitted,
 * consumers have full control over the popover's appearance.
 *
 * This example contrasts both approaches side by side:
 * - **Without Surface**: Fully custom-styled content in `Popover`
 * - **With Surface**: Uses the default elevation treatment
 */
export default function PopoverSurfaceVariantsExample(): React.ReactNode {
	return (
		<ForceFallbackToggle>
			{(forceFallbackPositioning) => (
				<Box padding="space.400">
					<Inline space="space.200">
						<CustomStyledPopoverDemo forceFallbackPositioning={forceFallbackPositioning} />
						<WithSurfacePopoverDemo forceFallbackPositioning={forceFallbackPositioning} />
					</Inline>
				</Box>
			)}
		</ForceFallbackToggle>
	);
}

function CustomStyledPopoverDemo({
	forceFallbackPositioning,
}: {
	forceFallbackPositioning: boolean;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();

	const close = useCallback(() => setIsOpen(false), []);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: { edge: 'end' },
		forceFallbackPositioning,
	});

	return (
		<>
			<Button ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
				Custom styled
			</Button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="dialog"
				label="Custom popup"
				isOpen={isOpen}
				onClose={close}
			>
				<div css={styles.customPopup}>
					<Stack space="space.100">
						<Heading size="xsmall">Custom styled</Heading>
						<Text>No PopoverSurface - all styling is applied directly by the consumer.</Text>
					</Stack>
				</div>
			</Popover>
		</>
	);
}

function WithSurfacePopoverDemo({
	forceFallbackPositioning,
}: {
	forceFallbackPositioning: boolean;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();

	const close = useCallback(() => setIsOpen(false), []);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: { edge: 'end' },
		forceFallbackPositioning,
	});

	return (
		<>
			<Button ref={triggerRef} appearance="primary" onClick={() => setIsOpen(!isOpen)}>
				With surface
			</Button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="dialog"
				label="Profile popup"
				isOpen={isOpen}
				onClose={close}
				onOpenChange={({ isOpen: nextOpen, element }) => {
					if (nextOpen) {
						getFirstFocusable({ container: element })?.focus();
					}
				}}
			>
				<PopoverSurface>
					<Stack space="space.100">
						<Heading size="xsmall">With PopoverSurface</Heading>
						<Text>
							Uses the default elevation, background, and border-radius from design tokens.
						</Text>
						<Inline space="space.100">
							<Button appearance="subtle">View profile</Button>
							<Button appearance="subtle">Settings</Button>
						</Inline>
					</Stack>
				</PopoverSurface>
			</Popover>
		</>
	);
}
