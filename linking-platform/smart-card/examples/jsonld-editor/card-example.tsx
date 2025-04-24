import React, { useCallback, useMemo } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { IntlProvider } from 'react-intl-next';

import { Box, Stack, Text } from '@atlaskit/primitives/compiled';

import { Card } from '../../src';
import { HoverCard } from '../../src/hoverCard';
import HoverCardBox from '../utils/hover-card-box';

import withJsonldEditorProvider from './jsonld-editor-provider';

const CardExample = ({
	isEmbedSupported = false,
	url,
}: {
	isEmbedSupported?: boolean;
	url?: string;
}) => {
	const fallback = useMemo(() => <span>😭Something went wrong.</span>, []);
	const onError = useCallback((err: Error) => console.error(err.message), []);

	return (
		<Stack space="space.100">
			<h6>Inline</h6>
			<div>
				Bowsprit scallywag weigh anchor Davy Jones' Locker warp ballast scurvy nipper brigantine
				Jolly Roger wench sloop Shiver me timbers rope's end chandler. Admiral of the Black cackle
				fruit deck{' '}
				<ErrorBoundary fallback={fallback} onError={onError}>
					<Card appearance="inline" url={url} showHoverPreview={true} />
				</ErrorBoundary>{' '}
				wench bounty rope's end bilge water scourge of the seven seas hardtack come about execution
				dock Nelsons folly handsomely rigging splice the main brace.
			</div>
			<h6>Block</h6>
			<ErrorBoundary fallback={fallback} onError={onError}>
				<Card appearance="block" platform="web" url={url} />
			</ErrorBoundary>
			<h6>Embed</h6>
			<Box paddingBlockStart="space.025">
				{isEmbedSupported ? (
					<ErrorBoundary fallback={fallback} onError={onError}>
						<Card appearance="embed" frameStyle="show" platform="web" url={url} />
					</ErrorBoundary>
				) : (
					<Text size="small">(Whoops! This link does not support embed view.)</Text>
				)}
			</Box>
			<h6>Hover card</h6>
			{url && (
				<IntlProvider locale="en">
					<HoverCard url={url}>
						<HoverCardBox />
					</HoverCard>
				</IntlProvider>
			)}
			<h6>Flexible</h6>
			<ul>
				<li>
					<a href="http://go/flexible-smart-links-docs" target="_blank">
						go/flexible-smart-links-docs
					</a>
				</li>
				<li>
					<a href="https://go/flexible-smart-links-builder" target="_blank">
						go/flexible-smart-links-builder
					</a>
				</li>
			</ul>
		</Stack>
	);
};

// Not the most elegant implementation but this will do.
export default withJsonldEditorProvider(CardExample);
