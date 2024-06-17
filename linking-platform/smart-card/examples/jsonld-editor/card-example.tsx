/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import React, { useCallback, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { IntlProvider } from 'react-intl-next';
import { Card } from '../../src';
import { HoverCard } from '../../src/hoverCard';
import FlexibleDataView from '../utils/flexible-data-view';
import withJsonldEditorProvider from './jsonld-editor-provider';

const CardExample: React.FC<{
	isEmbedSupported?: boolean;
	url?: string;
}> = ({ isEmbedSupported = false, url }) => {
	const fallback = useMemo(() => <span>😭Something went wrong.</span>, []);
	const onError = useCallback((err: Error) => console.error(err.message), []);

	return (
		<div>
			<h6>Inline</h6>
			<br />
			<div>
				Bowsprit scallywag weigh anchor Davy Jones' Locker warp ballast scurvy nipper brigantine
				Jolly Roger wench sloop Shiver me timbers rope's end chandler. Admiral of the Black cackle
				fruit deck{' '}
				<ErrorBoundary fallback={fallback} onError={onError}>
					<Card appearance="inline" url={url} showAuthTooltip={true} showHoverPreview={true} />
				</ErrorBoundary>{' '}
				wench bounty rope's end bilge water scourge of the seven seas hardtack come about execution
				dock Nelsons folly handsomely rigging splice the main brace.
			</div>
			<h6>Block</h6>
			<br />
			<ErrorBoundary fallback={fallback} onError={onError}>
				<Card appearance="block" platform="web" url={url} />
			</ErrorBoundary>
			<h6>Embed</h6>
			<br />
			{isEmbedSupported ? (
				<ErrorBoundary fallback={fallback} onError={onError}>
					<Card appearance="embed" platform="web" url={url} />
				</ErrorBoundary>
			) : (
				<div>
					<i>Whoops! This link does not support embed view.</i>
				</div>
			)}
			{url && (
				<IntlProvider locale="en">
					<br />
					<HoverCard url={url}>
						<h6> Standalone hover card</h6>
					</HoverCard>
				</IntlProvider>
			)}
			<h6>
				Flexible (
				<a href="http://go/flexible-smart-links-docs" target="_blank">
					go/flexible-smart-links-docs
				</a>
				)
			</h6>
			<br />
			<FlexibleDataView url={url} />
		</div>
	);
};

// Not the most elegant implementation but this will do.
export default withJsonldEditorProvider(CardExample);
