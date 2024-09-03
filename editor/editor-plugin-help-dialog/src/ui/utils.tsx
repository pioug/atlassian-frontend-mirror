/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { browser } from '@atlaskit/editor-common/browser';
import type { Keymap } from '@atlaskit/editor-common/keymaps';

import { codeLg, codeMd, codeSm, componentFromKeymapWrapperStyles } from './styles';

const getKeyParts = (keymap: Keymap) => {
	let shortcut: string = keymap[browser.mac ? 'mac' : 'windows'];
	if (browser.mac) {
		shortcut = shortcut.replace('Alt', 'Opt');
	}
	return shortcut.replace(/\-(?=.)/g, ' + ').split(' ');
};

export const shortcutNamesWithoutKeymap: string[] = ['table', 'emoji', 'mention', 'quickInsert'];

export const getComponentFromKeymap = (keymap: Keymap) => {
	const keyParts = getKeyParts(keymap);
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		<span css={componentFromKeymapWrapperStyles}>
			{keyParts.map((part, index) => {
				if (part === '+') {
					return <span key={`${keyParts}-${index}`}>{' + '}</span>;
				} else if (part === 'Cmd') {
					return (
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
						<span css={codeSm} key={`${keyParts}-${index}`}>
							⌘
						</span>
					);
				} else if (['ctrl', 'alt', 'opt', 'shift'].indexOf(part.toLowerCase()) >= 0) {
					return (
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
						<span css={codeMd} key={`${keyParts}-${index}`}>
							{part}
						</span>
					);
				} else if (['f9', 'f10'].indexOf(part.toLowerCase()) >= 0) {
					return (
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
						<span css={codeLg} key={`${keyParts}-${index}`}>
							{part}
						</span>
					);
				} else if (part.toLowerCase() === 'enter') {
					return (
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
						<span className="enter-keymap" css={codeSm} key={`${keyParts}-${index}`}>
							{'⏎'}
						</span>
					);
				}
				return (
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
					<span css={codeSm} key={`${keyParts}-${index}`}>
						{part.toUpperCase()}
					</span>
				);
			})}
		</span>
	);
};
