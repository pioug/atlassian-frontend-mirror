/** @jsx jsx */
import { jsx } from '@emotion/react';

import type { Keymap } from '@atlaskit/editor-common/keymaps';
import { browser } from '@atlaskit/editor-common/utils';

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
		<span css={componentFromKeymapWrapperStyles}>
			{keyParts.map((part, index) => {
				if (part === '+') {
					return <span key={`${keyParts}-${index}`}>{' + '}</span>;
				} else if (part === 'Cmd') {
					return (
						<span css={codeSm} key={`${keyParts}-${index}`}>
							⌘
						</span>
					);
				} else if (['ctrl', 'alt', 'opt', 'shift'].indexOf(part.toLowerCase()) >= 0) {
					return (
						<span css={codeMd} key={`${keyParts}-${index}`}>
							{part}
						</span>
					);
				} else if (['f9', 'f10'].indexOf(part.toLowerCase()) >= 0) {
					return (
						<span css={codeLg} key={`${keyParts}-${index}`}>
							{part}
						</span>
					);
				} else if (part.toLowerCase() === 'enter') {
					return (
						<span className="enter-keymap" css={codeSm} key={`${keyParts}-${index}`}>
							{'⏎'}
						</span>
					);
				}
				return (
					<span css={codeSm} key={`${keyParts}-${index}`}>
						{part.toUpperCase()}
					</span>
				);
			})}
		</span>
	);
};
