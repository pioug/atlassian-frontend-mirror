/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import Loadable from 'react-loadable';

import Spinner from '@atlaskit/spinner';

import type { Props as ElementBrowserProps } from '../ElementBrowser';

const spinnerContainer = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: '100%',
	width: '100%',
});

const ElementBrowserLoader = Loadable({
	loader: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-element-browser" */ '../ElementBrowser'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<ElementBrowserProps>>
		>,
	loading: () => (
		<div css={spinnerContainer}>
			<Spinner size="medium" interactionName="element-browser-spinner" />
		</div>
	),
});

export default ElementBrowserLoader;
