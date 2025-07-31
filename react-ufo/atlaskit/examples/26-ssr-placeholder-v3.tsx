/* eslint-disable @atlaskit/design-system/no-html-button */
/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, Suspense, useEffect, useLayoutEffect, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { getActiveInteraction } from '@atlaskit/react-ufo/interaction-metrics';
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
			<div
				data-testid="section-to-replace-final"
				css={csrContentStyles}
				data-ssr-placeholder-replace="fallback"
			>
				<span>This is a simulated CSR-ed content</span>
			</div>
		</Fragment>
	);
}

function FallbackComponent() {
	return (
		<UFOLoadHold name="fallback">
			<div
				data-testid="section-to-replace-placeholder"
				css={ssrContentStyles}
				data-ssr-placeholder="fallback"
			>
				<span>This is a simulated SSR-ed placeholder</span>
			</div>
		</UFOLoadHold>
	);
}

// SSR Fallback component
function SSRFallback() {
	useLayoutEffect(() => {
		// Populate window.__SSR_PLACEHOLDERS_DIMENSIONS__ with current placeholder dimensions
		const ssrPlaceholders = document.querySelectorAll('[data-ssr-placeholder]');
		if (ssrPlaceholders.length > 0) {
			// Initialize the global if it doesn't exist
			if (!window.__SSR_PLACEHOLDERS_DIMENSIONS__) {
				window.__SSR_PLACEHOLDERS_DIMENSIONS__ = {};
			}

			// Collect dimensions for each SSR placeholder
			ssrPlaceholders.forEach((element) => {
				const placeholderId = element.getAttribute('data-ssr-placeholder');
				if (placeholderId) {
					const rect = element.getBoundingClientRect();
					window.__SSR_PLACEHOLDERS_DIMENSIONS__![placeholderId] = {
						width: rect.width,
						height: rect.height,
						x: rect.x,
						y: rect.y,
						left: rect.left,
						top: rect.top,
						right: rect.right,
						bottom: rect.bottom,
						toJSON: () => ({}),
					};
				}
			});
		}

		// Trigger SSRPlaceholderHandlers to collect existing SSR placeholders
		if (window.__vcObserver && window.__vcObserver.collectSSRPlaceholders) {
			window.__vcObserver.collectSSRPlaceholders();
		}
		const interaction = getActiveInteraction();
		if (
			interaction &&
			interaction.vcObserver &&
			typeof interaction.vcObserver.collectSSRPlaceholders === 'function'
		) {
			interaction.vcObserver.collectSSRPlaceholders();
		}
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
