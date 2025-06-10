/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/** @jsxFrag */
import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { type SelectionExtensionComponentProps } from '@atlaskit/editor-plugin-selection-extension';
import { fg } from '@atlaskit/platform-feature-flags';
import { Popup } from '@atlaskit/popup';
import { xcss, Box } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const popupWrapperStyle = xcss({
	padding: 'space.250',
	maxWidth: '500px',
	maxHeight: '500px',
});

const EXAMPLE_LIVE_PAGE_PAGE_PADDING_TOP = 105;

/**
 * Heavily influenced by ForgeAction component contained within confluence
 * confluence/next/packages/highlight-actions/src/ForgeAction.tsx
 *
 */

export const ExampleForgeApp = ({
	closeExtension,
	selection,
}: SelectionExtensionComponentProps) => {
	return (
		<Popup
			content={() => {
				return (
					<Box xcss={popupWrapperStyle}>
						<h3>Demo Forge Extension</h3>
						<p>
							<i>{selection.text}</i>
						</p>
						<p>
							Coords: left: {selection.coords.left}, right: {selection.coords.right}, top:{' '}
							{selection.coords.top}, Bottom: {selection.coords.bottom}
						</p>
						<p>Coords highlighted by dashed lines</p>
						<br />
						<Button onClick={() => closeExtension()}>Close</Button>
					</Box>
				);
			}}
			isOpen
			placement="bottom"
			trigger={({ ref }) => (
				<span
					data-testid="forge-action-selection"
					ref={ref}
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
						position: 'absolute',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
						pointerEvents: 'none',
						border: `1px dashed ${token('color.border.accent.green', '#ccc')}`,
						top: selection.coords.top - EXAMPLE_LIVE_PAGE_PAGE_PADDING_TOP,
						left: selection.coords.left,
						width: selection.coords.right - selection.coords.left,
						height: selection.coords.bottom - selection.coords.top,
					}}
				></span>
			)}
			shouldRenderToParent={fg('should-render-to-parent-should-be-true-editor')}
		></Popup>
	);
};
