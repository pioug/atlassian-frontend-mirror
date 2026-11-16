/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import Loadable from 'react-loadable';

// oxlint-disable-next-line @atlassian/no-restricted-imports
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import Spinner from '@atlaskit/spinner/spinner';

import { ACTION_SUBJECT } from '../../analytics/types/enums';
import { ErrorBoundary } from '../../ui/ErrorBoundary';
import type { Props as ElementBrowserProps } from '../ElementBrowser';

const spinnerContainer = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: '100%',
	width: '100%',
});

const ElementBrowserLoading = () => (
	<div css={spinnerContainer}>
		<Spinner size="medium" interactionName="element-browser-spinner" />
	</div>
);

const loadElementBrowser = () =>
	import(
		/* webpackChunkName: "@atlaskit-internal_editor-element-browser" */ '../ElementBrowser'
	).then((module) => module.default) as Promise<
		React.ComponentType<React.PropsWithChildren<ElementBrowserProps>>
	>;

const loadElementBrowserModule = () =>
	loadElementBrowser().then((Component) => ({ default: Component }));
const ElementBrowserLazy = React.lazy(loadElementBrowserModule);

const ElementBrowserLoadable = Loadable({
	loader: loadElementBrowser,
	loading: ElementBrowserLoading,
});

const ElementBrowserLoader: React.ComponentType<React.PropsWithChildren<ElementBrowserProps>> &
	Loadable.LoadableComponent = (props) =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration') ? (
		<ErrorBoundary component={ACTION_SUBJECT.EDITOR} fallbackComponent={<ElementBrowserLoading />}>
			<React.Suspense fallback={<ElementBrowserLoading />}>
				{/* eslint-disable-next-line react/jsx-props-no-spreading */}
				<ElementBrowserLazy {...props} />
			</React.Suspense>
		</ErrorBoundary>
	) : (
		// eslint-disable-next-line react/jsx-props-no-spreading
		<ElementBrowserLoadable {...props} />
	);

ElementBrowserLoader.preload = () =>
	isExperimentEnabled('platform_editor_loosely_lazy_migration')
		? loadElementBrowser()
		: ElementBrowserLoadable.preload();

export default ElementBrowserLoader;
