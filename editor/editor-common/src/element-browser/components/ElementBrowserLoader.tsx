/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import Loadable from 'react-loadable';
// oxlint-disable-next-line @atlassian/no-restricted-imports
import { lazy, LazySuspense } from 'react-loosely-lazy';

// oxlint-disable-next-line @atlassian/no-restricted-imports
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import Spinner from '@atlaskit/spinner/spinner';

import type { Props as ElementBrowserProps } from '../ElementBrowser';

const spinnerContainer = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: '100%',
	width: '100%',
});

const loadElementBrowser = () =>
	import(
		/* webpackChunkName: "@atlaskit-internal_editor-element-browser" */ '../ElementBrowser'
	).then((module) => module.default) as Promise<
		React.ComponentType<React.PropsWithChildren<ElementBrowserProps>>
	>;

const ElementBrowserLazy = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_editor-element-browser" */ '../ElementBrowser'
		).then((module) => module.default) as Promise<
			React.ComponentType<React.PropsWithChildren<ElementBrowserProps>>
		>,
);
ElementBrowserLazy.displayName = 'lazy(ElementBrowser)';
const ElementBrowserLoadable = Loadable({
	loader: loadElementBrowser,
	loading: () => (
		<div css={spinnerContainer}>
			<Spinner size="medium" interactionName="element-browser-spinner" />
		</div>
	),
});

const ElementBrowserLoader: React.ComponentType<React.PropsWithChildren<ElementBrowserProps>> &
	Loadable.LoadableComponent = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<LazySuspense fallback={null}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading */}
			<ElementBrowserLazy {...props} />
		</LazySuspense>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading
		<ElementBrowserLoadable {...props} />
	);

ElementBrowserLoader.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? ElementBrowserLazy.preload()
		: ElementBrowserLoadable.preload();

export default ElementBrowserLoader;
