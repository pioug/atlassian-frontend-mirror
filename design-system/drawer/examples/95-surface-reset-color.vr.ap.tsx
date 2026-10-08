/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type CSSProperties, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { Drawer } from '@atlaskit/drawer/drawer';
import { DrawerContent } from '@atlaskit/drawer/drawer-content';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	// A red ancestor region. Under `platform-dst-top-layer` the drawer `<dialog>`
	// renders inline, as a DOM child of this region, so it inherits from it. This
	// red `color` is what leaks in if the host takes its parent's colour.
	region: {
		color: token('color.text.danger'),
		backgroundColor: token('color.background.danger'),
		minHeight: '100vh',
		paddingBlockStart: token('space.400'),
		paddingInlineEnd: token('space.400'),
		paddingBlockEnd: token('space.400'),
		paddingInlineStart: token('space.400'),
	},
});

/**
 * Gemini VR compares pixels with Playwright's default threshold (0.2), which
 * cannot tell UA `CanvasText` (#000000) from `color.text` (#292A2E). Setting
 * `--ds-text` to vivid blue (#0055FF) on the region makes the expected colour
 * differ from black and from the region red (`color.text.danger`, #AE2E24).
 * The host's `color: var(--ds-text)` resolves at the host, which inherits this
 * value. It beats the theme value, which is only set on `html`.
 */
const vividTextStyle = { '--ds-text': '#0055FF' } as CSSProperties;

/**
 * Baseline for the top-layer host `color` reset on an open Drawer whose content
 * is raw text with no colour of its own.
 *
 * Expected: the drawer text is vivid blue (#0055FF).
 *
 * - Black text means the UA `dialog` `color: CanvasText` came back.
 * - Red text means the region colour leaked into the drawer.
 */
export default function DrawerSurfaceResetColorExample(): JSX.Element {
	const [isDrawerOpen, setIsDrawerOpen] = useState(true);

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- overrides a token variable for the VR, see `vividTextStyle`
		<div css={styles.region} style={vividTextStyle}>
			Text outside the drawer is red.
			<Drawer
				isOpen={isDrawerOpen}
				label="Drawer surface reset colour"
				onClose={() => setIsDrawerOpen(false)}
				testId="drawer"
			>
				<DrawerContent>Drawer text is the default text colour.</DrawerContent>
			</Drawer>
		</div>
	);
}
