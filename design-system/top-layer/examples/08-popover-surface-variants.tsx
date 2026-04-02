/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { getFirstFocusable } from '@atlaskit/top-layer/focus';
import { Popup } from '@atlaskit/top-layer/popup';
import { PopupSurface } from '@atlaskit/top-layer/popup-surface';

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
 * `PopupSurface` is optional — it provides default elevation styling
 * (background, border-radius, box-shadow) via design tokens. When omitted,
 * consumers have full control over the popup's appearance.
 *
 * This example contrasts both approaches side by side:
 * - **Without Surface**: Fully custom-styled content in `Popup.Content`
 * - **With Surface**: Uses the default elevation treatment
 */
export default function PopoverSurfaceVariantsExample(): JSX.Element {
	return (
		<ForceFallbackToggle>
			{(forceFallbackPositioning) => (
				<Box padding="space.400">
					<Inline space="space.200">
						<Popup
							placement={{ edge: 'end' }}
							onClose={() => {}}
							forceFallbackPositioning={forceFallbackPositioning}
						>
							<Popup.Trigger>
								<Button>Custom styled</Button>
							</Popup.Trigger>
							<Popup.Content role="dialog" label="Custom popup">
								<div css={styles.customPopup}>
									<Stack space="space.100">
										<Heading size="xsmall">Custom styled</Heading>
										<Text>No PopupSurface — all styling is applied directly by the consumer.</Text>
									</Stack>
								</div>
							</Popup.Content>
						</Popup>

						<Popup
							placement={{ edge: 'end' }}
							onClose={() => {}}
							onOpenChange={({ isOpen, element }) => {
								if (isOpen) {
									getFirstFocusable({ container: element })?.focus();
								}
							}}
							forceFallbackPositioning={forceFallbackPositioning}
						>
							<Popup.Trigger>
								<Button appearance="primary">With surface</Button>
							</Popup.Trigger>
							<Popup.Content role="dialog" label="Profile popup">
								<PopupSurface>
									<Stack space="space.100">
										<Heading size="xsmall">With PopupSurface</Heading>
										<Text>
											Uses the default elevation, background, and border-radius from design tokens.
										</Text>
										<Inline space="space.100">
											<Button appearance="subtle">View profile</Button>
											<Button appearance="subtle">Settings</Button>
										</Inline>
									</Stack>
								</PopupSurface>
							</Popup.Content>
						</Popup>
					</Inline>
				</Box>
			)}
		</ForceFallbackToggle>
	);
}
