/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { type Mark } from '@atlaskit/editor-prosemirror/model';
import { Card } from '@atlaskit/smart-card';
import { CardSSR } from '@atlaskit/smart-card/ssr';
import { UnsupportedInline } from '@atlaskit/editor-common/ui';
import type { EventHandlers } from '@atlaskit/editor-common/ui';
import { fg } from '@atlaskit/platform-feature-flags';

import { CardErrorBoundary } from './fallback';
import type { WithSmartCardStorageProps } from '../../ui/SmartCardStorage';
import { withSmartCardStorage } from '../../ui/SmartCardStorage';
import { getCardClickHandler } from '../utils/getCardClickHandler';
import type { SmartLinksOptions } from '../../types/smartLinksOptions';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import {
	useInlineAnnotationProps,
	type MarkDataAttributes,
} from '../../ui/annotations/element/useInlineAnnotationProps';
import { usePortal } from '../../ui/Renderer/PortalContext';

export interface InlineCardProps extends MarkDataAttributes {
	url?: string;
	data?: object;
	eventHandlers?: EventHandlers;
	portal?: HTMLElement;
	smartLinks?: SmartLinksOptions;
	marks?: Mark[];
}

const InlineCard = (props: InlineCardProps & WithSmartCardStorageProps) => {
	const { url, data, eventHandlers, smartLinks } = props;
	const portal = usePortal(props);
	const onClick = getCardClickHandler(eventHandlers, url);
	const cardProps = {
		url,
		data,
		onClick,
		container: portal,
	};
	const { hideHoverPreview, actionOptions, ssr } = smartLinks || {};

	const analyticsData = {
		attributes: {
			location: 'renderer',
		},
		// Below is added for the future implementation of Linking Platform namespaced analytic context
		location: 'renderer',
	};

	const inlineAnnotationProps = useInlineAnnotationProps(props);

	const CompetitorPrompt = smartLinks?.CompetitorPrompt;
	const CompetitorPromptComponent =
		CompetitorPrompt && url && fg('prompt_whiteboard_competitor_link_gate') ? (
			<CompetitorPrompt sourceUrl={url} linkType="inline" />
		) : null;

	if (ssr && url) {
		if (
			// eslint-disable-next-line @atlaskit/platform/no-invalid-feature-flag-usage
			fg('editor_inline_comments_on_inline_nodes')
		) {
			return (
				<span
					data-inline-card
					data-card-data={data ? JSON.stringify(data) : undefined}
					data-card-url={url}
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...inlineAnnotationProps}
				>
					<AnalyticsContext data={analyticsData}>
						<CardSSR
							appearance="inline"
							url={url}
							showHoverPreview={!hideHoverPreview}
							actionOptions={actionOptions}
							onClick={onClick}
						/>
					</AnalyticsContext>
				</span>
			);
		}
		return (
			<AnalyticsContext data={analyticsData}>
				<CardSSR
					appearance="inline"
					url={url}
					showHoverPreview={!hideHoverPreview}
					actionOptions={actionOptions}
					onClick={onClick}
				/>
			</AnalyticsContext>
		);
	}

	const onError = ({ err }: { err?: Error }) => {
		if (err) {
			throw err;
		}
	};

	return (
		<AnalyticsContext data={analyticsData}>
			<span
				data-inline-card
				data-card-data={data ? JSON.stringify(data) : undefined}
				data-card-url={url}
				// Ignored via go/ees005
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...inlineAnnotationProps}
			>
				<CardErrorBoundary
					unsupportedComponent={UnsupportedInline}
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...cardProps}
				>
					<Card
						appearance="inline"
						showHoverPreview={!hideHoverPreview}
						actionOptions={actionOptions}
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...cardProps}
						onResolve={(data) => {
							if (!data.url || !data.title) {
								return;
							}

							props.smartCardStorage.set(data.url, data.title);
						}}
						onError={onError}
					/>
					{CompetitorPromptComponent}
				</CardErrorBoundary>
			</span>
		</AnalyticsContext>
	);
};

export default withSmartCardStorage(InlineCard);
