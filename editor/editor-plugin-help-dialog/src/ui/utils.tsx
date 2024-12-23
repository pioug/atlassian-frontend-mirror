/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { browser } from '@atlaskit/editor-common/browser';
import type { Keymap } from '@atlaskit/editor-common/keymaps';
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { componentFromKeymapWrapperStyles } from './styles';

const codeLg = xcss({
	borderRadius: 'border.radius',
	display: 'inline-block',
	height: token('space.300'),
	lineHeight: token('space.300'),
	textAlign: 'center',
	paddingInline: 'space.150',
	backgroundColor: 'color.background.neutral',
});

const codeMd = xcss({
	backgroundColor: 'color.background.neutral',
	borderRadius: 'border.radius',
	display: 'inline-block',
	height: token('space.300'),
	lineHeight: token('space.300'),
	width: '50px',
	textAlign: 'center',
});

const codeSm = xcss({
	backgroundColor: 'color.background.neutral',
	borderRadius: 'border.radius',
	width: token('space.300'),
	display: 'inline-block',
	height: token('space.300'),
	lineHeight: token('space.300'),
	textAlign: 'center',
});

const getKeyParts = (keymap: Keymap) => {
	let shortcut: string = keymap[browser.mac ? 'mac' : 'windows'];
	if (browser.mac) {
		shortcut = shortcut.replace('Alt', 'Opt');
	}
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
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
					return (
						// Ignored via go/ees005
						// eslint-disable-next-line react/no-array-index-key
						<Box as="span" key={`${keyParts}-${index}`}>
							{' + '}
						</Box>
					);
				} else if (part === 'Cmd') {
					return (
						// Ignored via go/ees005
						// eslint-disable-next-line react/no-array-index-key
						<Box as="span" xcss={codeSm} key={`${keyParts}-${index}`}>
							⌘
						</Box>
					);
				} else if (['ctrl', 'alt', 'opt', 'shift'].indexOf(part.toLowerCase()) >= 0) {
					return (
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
						// Ignored via go/ees005
						// eslint-disable-next-line react/no-array-index-key
						<Box as="span" xcss={codeMd} key={`${keyParts}-${index}`}>
							{part}
						</Box>
					);
				} else if (['f9', 'f10'].indexOf(part.toLowerCase()) >= 0) {
					return (
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
						// Ignored via go/ees005
						// eslint-disable-next-line react/no-array-index-key
						<Box as="span" xcss={codeLg} key={`${keyParts}-${index}`}>
							{part}
						</Box>
					);
				} else if (part.toLowerCase() === 'enter') {
					return (
						<Box
							as="span"
							data-editor-help-dialog-enter-keymap="true"
							xcss={codeSm}
							// Ignored via go/ees005
							// eslint-disable-next-line react/no-array-index-key
							key={`${keyParts}-${index}`}
						>
							{'⏎'}
						</Box>
					);
				}
				return (
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
					// Ignored via go/ees005
					// eslint-disable-next-line react/no-array-index-key
					<Box as="span" xcss={codeSm} key={`${keyParts}-${index}`}>
						{part.toUpperCase()}
					</Box>
				);
			})}
		</span>
	);
};
