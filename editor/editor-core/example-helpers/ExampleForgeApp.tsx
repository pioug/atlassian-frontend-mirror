/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import type { SelectionExtensionComponentProps } from '@atlaskit/editor-plugin-selection-extension/types';
import { Popup } from '@atlaskit/popup/popup';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	popupWrapperStyle: {
		paddingTop: token('space.250'),
		paddingRight: token('space.250'),
		paddingBottom: token('space.250'),
		paddingLeft: token('space.250'),
		maxWidth: '500px',
		maxHeight: '500px',
	},
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
}: SelectionExtensionComponentProps): JSX.Element => {
	return (
		<Popup
			content={() => {
				return (
					<Box xcss={styles.popupWrapperStyle}>
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
						border: `${token('border.width')} dashed ${token('color.border.accent.green')}`,
						top: selection.coords.top - EXAMPLE_LIVE_PAGE_PAGE_PADDING_TOP,
						left: selection.coords.left,
						width: selection.coords.right - selection.coords.left,
						height: selection.coords.bottom - selection.coords.top,
					}}
				></span>
			)}
			shouldRenderToParent={true}
		></Popup>
	);
};
