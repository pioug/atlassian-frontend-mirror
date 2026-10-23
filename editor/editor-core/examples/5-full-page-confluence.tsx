/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage/preview */

import type { JSX } from 'react';
import { useEffect, useState } from 'react';

// The loading blanket styles a child rendered by another component.
// These styles require selectors or values outside @atlaskit/css.
import { css, jsx } from '@compiled/react';

import type { EditorAppearance } from '@atlaskit/editor-common/types/editor-appearance';
import Spinner from '@atlaskit/spinner/spinner';

import SidebarContainer from '../example-helpers/SidebarContainer';
import { PresetContextProvider } from '../src/presets/context';
import FullPageExample, { getAppearance } from './5-full-page';

const disabledBlanket = css({
	position: 'absolute',
	top: '0px',
	left: '0px',
	width: '100%',
	height: '100%',
	background: 'rgba(0, 0, 0, 0.03)',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> *': {
		marginTop: '50vh',
		marginLeft: '50vw',
	},
});

/**
 * Example designed to be similar to how the editor is within Confluence's Edit mode
 * Has:
 *  - 64px sidebar on the left
 *  - collab editing enabled
 */
const ExampleEditorComponent = (): JSX.Element => {
	const [disabled, setDisabled] = useState(true);
	const [appearance, setAppearance] = useState<EditorAppearance>(getAppearance() || 'full-page');

	useEffect(() => {
		// Simulate async nature of confluence fetching appearance
		const timeout = Math.floor(Math.random() * (1500 - 750 + 1)) + 750;
		console.log(`async delay is ${timeout}`);
		const appearanceTimeoutId = window.setTimeout(() => {
			setDisabled(false);
			setAppearance(getAppearance());
		}, timeout);

		return () => {
			window.clearTimeout(appearanceTimeoutId);
		};
	}, []);

	return (
		<SidebarContainer>
			{disabled && (
				<div css={disabledBlanket}>
					<Spinner size="large" />
				</div>
			)}
			<PresetContextProvider>
				<FullPageExample
					editorProps={{
						elementBrowser: {
							showModal: true,
							replacePlusMenu: true,
						},
						disabled,
						appearance,
						shouldFocus: true,
					}}
				/>
			</PresetContextProvider>
		</SidebarContainer>
	);
};

export default ExampleEditorComponent;
