/* eslint-disable @atlaskit/design-system/no-html-button */
/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, Suspense, useEffect, useLayoutEffect, useState } from 'react';

import { css, jsx } from '@compiled/react';

import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment from '@atlaskit/react-ufo/segment';

const mainStyles = css({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	minHeight: '100vh',
	borderWidth: '2px',
	borderStyle: 'solid',
	borderColor: 'black',
	padding: '20px',
});

const csrContentStyles = css({
	padding: '20px',
	borderRadius: '8px',
	textAlign: 'center',
	width: '50vh',
	height: '50vh',
	boxSizing: 'border-box',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	position: 'relative',
	margin: '0',
	borderWidth: '0',
	borderStyle: 'none',
	backgroundColor: '#90EE90', // light green
});

const ssrContentStyles = css({
	padding: '20px',
	borderRadius: '8px',
	textAlign: 'center',
	width: '50vh',
	height: '50vh',
	boxSizing: 'border-box',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	position: 'relative',
	margin: '0',
	borderWidth: '0',
	borderStyle: 'none',
	backgroundColor: '#FFFFE0', // light yellow
});

let loadingPromise: Promise<void> | null = null;
let isDataLoaded = false;

function CSRComponent() {
	// extra loading to ensure mutation observer got the mutation, as it is async
	const [extraLoading, setExtraLoading] = useState(true);

	if (!isDataLoaded) {
		if (!loadingPromise) {
			loadingPromise = new Promise((resolve) => {
				setTimeout(() => {
					isDataLoaded = true;
					resolve();
				}, 1000);
			});
		}
		// This throw will cause React to reconcile and re-render when resolved
		throw loadingPromise;
	}

	useEffect(() => {
		setTimeout(() => {
			setTimeout(() => {
				setExtraLoading(false);
			}, 500);
		}, 1);
	}, []);

	// React will reconcile this component when the promise resolves
	// Initially hidden due to Suspense, then shown when promise resolves
	return (
		<Fragment>
			<UFOLoadHold name="extra-loading" hold={extraLoading} />
			<div data-testid="section-to-replace-final" css={csrContentStyles}>
				<span>This is a simulated CSR-ed content</span>
			</div>
		</Fragment>
	);
}

function FallbackComponent() {
	return (
		<UFOLoadHold name="fallback">
			<div data-testid="section-to-replace-placeholder" css={ssrContentStyles}>
				<span>This is a simulated SSR-ed placeholder</span>
			</div>
		</UFOLoadHold>
	);
}

// SSR Fallback component
function SSRFallback() {
	useLayoutEffect(() => {
		// Force RLLPlaceholderHandlers to collect placeholders
		// @ts-expect-error
		window.__REACT_UFO_RLL_PLACEHOLDER_HANDLERS__?.collectRLLPlaceholders();
	}, []);

	return (
		<UFOLoadHold name="ssr-fallback">
			<FallbackComponent />
		</UFOLoadHold>
	);
}

/**
 * Simulate React Loosely Lazy behavior
 */
export default function Example() {
	const [hasTTFB, setHasTTFB] = useState(false);
	const [startSuspense, setStartSuspense] = useState(false);

	useEffect(() => {
		// Reset the loading state when component mounts
		isDataLoaded = false;
		loadingPromise = null;

		let timeoutId = setTimeout(() => {
			setHasTTFB(true);

			timeoutId = setTimeout(() => {
				setStartSuspense(true);
			}, 1000);
		}, 200);

		return () => clearTimeout(timeoutId);
	}, []);

	return (
		<UFOSegment name="app-root">
			<UFOLoadHold name="ttfb" hold={!hasTTFB} />
			{hasTTFB && (
				<div data-testid="main" css={mainStyles}>
					{startSuspense ? (
						<Suspense fallback={<SSRFallback />}>
							<CSRComponent />
						</Suspense>
					) : (
						<SSRFallback />
					)}
				</div>
			)}
		</UFOSegment>
	);
}
