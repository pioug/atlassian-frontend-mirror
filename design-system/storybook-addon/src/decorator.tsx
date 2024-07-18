import React, { type CSSProperties, Fragment, type ReactNode } from 'react';

import { useEffect } from '@storybook/preview-api';
import type { Renderer, StoryContext, PartialStoryFn as StoryFunction } from '@storybook/types';

import { setGlobalTheme, token } from '@atlaskit/tokens';

import { type Themes } from './types';

const splitColumnStyles: CSSProperties = {
	position: 'absolute',
	boxSizing: 'border-box',
	width: '50vw',
	height: '100vh',
	overflow: 'auto',
	padding: '10px',
	background: token('elevation.surface'),
	color: token('color.text'),
};

const stackColumnStyles: CSSProperties = {
	position: 'absolute',
	boxSizing: 'border-box',
	width: '100%',
	height: '50%',
	overflow: 'auto',
	padding: '10px',
	background: token('elevation.surface'),
	color: token('color.text'),
};

const withDesignTokens = (StoryFn: StoryFunction<Renderer>, context: StoryContext<Renderer>) => {
	const theme = (context.globals.adsTheme as Themes) || 'auto';

	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
		(async () => {
			switch (theme) {
				case 'light':
				case 'dark':
				case 'auto':
					await setGlobalTheme({
						colorMode: theme,
						spacing: 'spacing',
						shape: 'shape',
						typography: 'typography-minor3',
					});
					break;
				case 'split':
				case 'stack':
					await setGlobalTheme({
						colorMode: 'light',
						spacing: 'spacing',
						shape: 'shape',
						typography: 'typography-minor3',
					});

					document.documentElement.querySelectorAll('style[data-theme]').forEach((el) => {
						const clone = el.cloneNode(true) as Element;
						clone.setAttribute('data-theme', clone.getAttribute('data-theme') + '-clone');
						// HACK: re-target theme selectors to split div containers
						clone.textContent = clone.textContent!.replace(/html\[/g, '[');
						document.head.append(clone);
					});

					break;
				case 'none':
					delete document.documentElement.dataset.theme;
					delete document.documentElement.dataset.colorMode;
					document.documentElement
						.querySelectorAll('style[data-theme]')
						.forEach((el) => el.remove());
					break;
				default:
					break;
			}
		})();
	}, [context.id, theme]);
	function renderStory() {
		const story = StoryFn({
			...context,
			globals: {
				...context.globals,
				adsTheme: theme,
			},
		}) as ReactNode;

		if (theme === 'split' || theme === 'stack') {
			return (
				<Fragment>
					<div
						data-theme="light:light"
						data-color-mode="light"
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={
							theme === 'split'
								? { ...splitColumnStyles, inset: '0px 50vw 0px 0px' }
								: { ...stackColumnStyles, inset: '0px 0px 50% 0px' }
						}
					>
						{story}
					</div>
					<div
						data-theme="dark:dark"
						data-color-mode="dark"
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={
							theme === 'split'
								? { ...splitColumnStyles, inset: '0px 0px 0px 50vw' }
								: { ...stackColumnStyles, inset: '50% 0px 0px 0px' }
						}
					>
						{story}
					</div>
				</Fragment>
			);
		}

		return <div>{story}</div>;
	}

	return renderStory();
};

export default withDesignTokens;
