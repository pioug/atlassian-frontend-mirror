import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { doc, emoji, p } from '@atlaskit/adf-utils/builders';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { buildCaches, type NodeDataProvidersCache } from '@atlaskit/node-data-provider/cache';
import {
	__testOnly_resetGlobalNdpCachesContext,
	ContentNodeDataProviders,
	useContentNodeDataProviders,
} from '@atlaskit/node-data-provider/content';
import { getConfluencePageProviders } from '@atlaskit/node-data-provider/get-confluence-page-providers';
import { currentUser, getEmojiProvider } from '@atlaskit/util-data-test/get-emoji-provider';

function ExampleNoNodeDataProviders() {
	const universalPreset = useUniversalPreset({
		props: {
			emojiProvider: slowedEmojiProvider,
		},
	});

	const { preset } = usePreset(() => {
		return universalPreset;
	}, [universalPreset]);

	return (
		<ComposableEditor
			preset={preset}
			emojiProvider={slowedEmojiProvider}
			defaultValue={exampleDocument}
		/>
	);
}

function ComposableEditorWithNodeDataProviders() {
	const contentNodeDataProviders = useContentNodeDataProviders();
	const universalPreset = useUniversalPreset({
		props: {
			emojiProvider: slowedEmojiProvider,
		},
		initialPluginConfiguration: {
			emoji: {
				emojiNodeDataProvider: contentNodeDataProviders!.emoji,
			},
		},
	});

	const { preset } = usePreset(() => {
		return universalPreset;
	}, [universalPreset]);

	return (
		<ComposableEditor
			preset={preset}
			emojiProvider={slowedEmojiProvider}
			defaultValue={exampleDocument}
		/>
	);
}

function ExampleNodeDataProviders({
	existingProvidersCache,
}: {
	existingProvidersCache?: NodeDataProvidersCache;
}) {
	return (
		<ContentNodeDataProviders
			contentType="page"
			contentId="9001"
			adf={exampleDocument}
			existingProvidersCache={existingProvidersCache}
			getNodeDataProviders={() =>
				getConfluencePageProviders({ emojiProvider: slowedEmojiProvider })
			}
		>
			<ComposableEditorWithNodeDataProviders />
		</ContentNodeDataProviders>
	);
}

export default function NodeDataProvidersExample() {
	const cache = useCache();
	return (
		<ExampleTabsWithObs
			tabs={[
				{
					label: 'No NodeView data providers',
					content: <ExampleNoNodeDataProviders />,
				},
				{
					label: 'With NodeView data providers (no cache)',
					content: <ExampleNodeDataProviders />,
				},

				{
					label:
						'With NodeView data providers (cached)' +
						(cache.loaded ? ' [ready]' : '[loading cache]'),
					content: (
						<ExampleNodeDataProviders existingProvidersCache={cache.fullNodeDataProvidersCache} />
					),
				},
				{
					label:
						'With NodeView data providers (partially cached)' +
						(cache.loaded ? ' [ready]' : '[loading cache]'),
					content: (
						<ExampleNodeDataProviders
							existingProvidersCache={cache.partialNodeDataProvidersCache}
						/>
					),
				},
			]}
		></ExampleTabsWithObs>
	);
}

// --- Helper functions and example data/providers ---

function useCache() {
	const [loaded, setLoaded] = React.useState<{
		loaded: boolean;
		fullNodeDataProvidersCache?: NodeDataProvidersCache;
		partialNodeDataProvidersCache?: NodeDataProvidersCache;
	}>({ loaded: false });
	React.useEffect(() => {
		Promise.all([
			buildCaches({
				adf: exampleDocument,
				nodeDataProviders: getConfluencePageProviders({
					emojiProvider: getEmojiProvider({ uploadSupported: true, currentUser }),
				}),
			}),
			buildCaches({
				adf: doc(
					p(emoji({ shortName: ':blue_star:', id: 'atlassian-blue_star', text: ':blue_star:' })),
				),
				nodeDataProviders: getConfluencePageProviders({
					emojiProvider: getEmojiProvider({ uploadSupported: true, currentUser }),
				}),
			}),
		]).then(([fullNodeDataProvidersCache]) => {
			setLoaded({ loaded: true, fullNodeDataProvidersCache });
		});
	}, []);
	return loaded;
}

const exampleDocument = doc(...new Array(5).fill([getEmojiParagraph()]).flat());
let slowedEmojiProvider = getSlowedEmojiProvider();

function getEmojiParagraph() {
	return p(
		...new Array(42)
			.fill([
				emoji({
					shortName: ':green_star:',
					id: 'atlassian-green_star',
					text: ':green_star:',
				}),
				emoji({
					shortName: ':blue_star:',
					id: 'atlassian-blue_star',
					text: ':blue_star:',
				}),
			])
			.flat(),
	);
}

async function getSlowedEmojiProvider() {
	const emojiProvider = await getEmojiProvider({
		uploadSupported: true,
		currentUser,
	});

	const emojiMap: { [key: string]: Promise<void> } = {};

	let originalFetchByEmojiId = emojiProvider.fetchByEmojiId;
	emojiProvider.fetchByEmojiId = async (emojiId, optimistic) => {
		const key = `${emojiId.id}-${emojiId.shortName}-${emojiId.fallback}`;
		if (!emojiMap[key]) {
			emojiMap[key] = new Promise((resolve) => {
				setTimeout(resolve, 50);
			});
		}
		await emojiMap[key];
		const result = await originalFetchByEmojiId.call(emojiProvider, emojiId, optimistic);

		return result;
	};
	return emojiProvider;
}

function ExampleTabsWithObs(props: { tabs: { label: string; content: React.ReactNode }[] }) {
	function resetProviders() {
		slowedEmojiProvider = getSlowedEmojiProvider();
		__testOnly_resetGlobalNdpCachesContext();
	}

	const [example, setExample] = React.useState('');

	function handleChangeExample(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const example = formData.get('example') as string;
		resetProviders();

		setExample('');
		setTimeout(setExample, 300, example);
	}

	return (
		<IntlProvider locale="en">
			<p>
				There are various cache layers outside the node view data provider. Which means that the
				first time you open an example will be the most accurate (as subsequent opens will have
				various parts cached).
			</p>
			<hr />
			<form onSubmit={handleChangeExample}>
				<fieldset>
					<legend>Select an example</legend>
					<div>
						<label htmlFor="full">Full cache</label>
						<select id="example" name="example">
							{props.tabs.map((tab) => (
								<option key={tab.label} value={tab.label}>
									{tab.label}
								</option>
							))}
						</select>
					</div>
				</fieldset>
				{/* eslint-disable-next-line @atlaskit/design-system/no-html-button */}
				<button type="submit">Load</button>
			</form>
			<br />
			<p>key: {example}</p>
			<React.Fragment key={example}>
				{example !== '' && (
					<ObserveLayoutShiftAndStability>
						{props.tabs.find((tab) => tab.label === example)?.content}
					</ObserveLayoutShiftAndStability>
				)}
			</React.Fragment>
		</IntlProvider>
	);
}

function ObserveLayoutShiftAndStability({ children }: { children: React.ReactNode }) {
	const perf = useLayoutShiftAndStability();

	return (
		<>
			<ul>
				<li>
					CLS score:{' '}
					{`${perf.clsScore} (${perf.clsScore < 0.1 ? 'good' : perf.clsScore < 0.1 ? 'needs improvement' : 'poor'})`}
				</li>
				<li>Time to stable: {`${perf.timeToStable}ms`}</li>
			</ul>
			<div ref={perf.ref}>{children}</div>
		</>
	);
}

// Hook to measure Cumulative Layout Shift
// Combined hook to measure Cumulative Layout Shift and Time to Visual Stability
function useLayoutShiftAndStability() {
	const ref = React.useRef<HTMLDivElement>(null);
	const [clsScore, setClsScore] = React.useState(0);
	const [timeToStable, setTimeToStable] = React.useState<number>(0);
	React.useEffect(() => {
		// Ensure ref.current is available and PerformanceObserver is supported by the browser
		if (!ref.current || typeof PerformanceObserver === 'undefined') {
			return;
		}
		let cumulativeLayoutShift = 0;
		let timerStart = performance.now();

		// Callback function to execute when layout shifts are observed
		const shiftObserver = new PerformanceObserver((list) => {
			for (const entry of list.getEntries()) {
				const shiftEntry = entry as PerformanceEntry & {
					value: number;
					hadRecentInput: boolean;
					sources?: Array<{ node: Element }>;
				};
				// Ignore layout shifts that had recent input
				if (!shiftEntry.hadRecentInput) {
					// Check if any of the shifted nodes are contained within the observed ref
					const isWithinObservedRef =
						shiftEntry.sources?.some((source) => ref.current!.contains(source.node)) ?? false;
					if (isWithinObservedRef) {
						cumulativeLayoutShift += shiftEntry.value;
						setClsScore(cumulativeLayoutShift);
						setTimeToStable(performance.now() - timerStart);
					}
				}
			}
			// Calculate Time to Visual Stability if it hasn't been recorded yet
		});
		// Start observing layout shift entries
		shiftObserver.observe({ type: 'layout-shift', buffered: true });
		// Cleanup function to disconnect the observer
		return () => {
			shiftObserver.disconnect();
		};
	}, []);
	return { clsScore, timeToStable, ref };
}
