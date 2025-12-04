import type { EventHandler, KeyboardEvent, MouseEvent } from 'react';
import React, { useCallback } from 'react';

import { isSafeUrl } from '@atlaskit/adf-schema';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { OnClickCallback } from '@atlaskit/editor-common/card';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import {
	type NamedPluginStatesFromInjectionAPI,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type { ProviderFactory, Providers } from '@atlaskit/editor-common/provider-factory';
import type { ReactComponentProps, getPosHandler } from '@atlaskit/editor-common/react-node-view';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { getAnalyticsEditorAppearance } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import Link from '@atlaskit/link';
import { type CardContext } from '@atlaskit/link-provider';
import type { APIError } from '@atlaskit/linking-common';
import { fg } from '@atlaskit/platform-feature-flags';
import type { CardProps as BaseCardProps } from '@atlaskit/smart-card';

import type { CardPlugin } from '../cardPluginType';
import type { cardPlugin } from '../index';
import { changeSelectedCardToLinkFallback } from '../pm-plugins/doc';
import { getPluginState } from '../pm-plugins/util/state';
import { titleUrlPairFromNode } from '../pm-plugins/utils';
import { WithCardContext } from '../ui/WithCardContext';

export type EditorContext<T> = React.Context<T> & { value: T };

const fatalErrorPositionMap = new Map<string, number>();

export interface CardNodeViewProps extends ReactComponentProps {
	eventDispatcher?: EventDispatcher;
	providerFactory?: ProviderFactory;
}

export interface CardProps extends CardNodeViewProps {
	__livePage?: boolean;
	actionOptions?: BaseCardProps['actionOptions'];
	allowResizing?: boolean;
	children?: React.ReactNode;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	eventDispatcher?: EventDispatcher;
	fullWidthMode?: boolean;
	getPos: getPosHandler;
	hoverPreviewOptions?: BaseCardProps['hoverPreviewOptions'];
	node: PMNode;
	onClickCallback?: OnClickCallback;
	pluginInjectionApi?: ExtractInjectionAPI<typeof cardPlugin>;
	showHoverPreview?: BaseCardProps['showHoverPreview'];
	useAlternativePreloader?: boolean;
	view: EditorView;
}

export interface SmartCardProps extends CardProps {
	allowBlockCards?: boolean;
	allowEmbeds?: boolean;
	cardContext?: EditorContext<CardContext | undefined>;
	CompetitorPrompt?: React.ComponentType<{ linkType?: string; sourceUrl: string }>;
	disablePreviewPanel?: BaseCardProps['disablePreviewPanel'];
	enableInlineUpgradeFeatures?: boolean;
	isHovered?: boolean;
	isPageSSRed?: boolean;
	onClick?: EventHandler<MouseEvent | KeyboardEvent> | undefined;
	onResolve?: (tr: Transaction, title?: string) => void;
	pluginInjectionApi?: ExtractInjectionAPI<typeof cardPlugin>;
	provider?: Providers['cardProvider'];
}

const WithClickHandler = ({
	pluginInjectionApi,
	url,
	onClickCallback,
	children,
}: {
	children: (props: {
		onClick: ((e: React.MouseEvent<HTMLAnchorElement>) => void) | undefined;
	}) => React.ReactNode;
	onClickCallback?: OnClickCallback;
	pluginInjectionApi: ExtractInjectionAPI<CardPlugin> | undefined;
	url?: string;
}) => {
	const { mode } = useSharedPluginStateWithSelector(
		pluginInjectionApi,
		['editorViewMode'],
		(
			states: NamedPluginStatesFromInjectionAPI<
				ExtractInjectionAPI<typeof cardPlugin>,
				'editorViewMode'
			>,
		) => {
			return {
				mode: states.editorViewModeState?.mode,
			};
		},
	);
	const onClick = useCallback(
		(event: React.MouseEvent<HTMLAnchorElement>) => {
			if (typeof onClickCallback === 'function') {
				try {
					onClickCallback({
						event,
						url,
					});
				} catch {}
			}
		},
		[url, onClickCallback],
	);

	// Setting `onClick` to `undefined` ensures clicks on smartcards navigate to the URL.
	// If in view mode and not overriding with onClickCallback option, then allow smartlinks to navigate on click.
	const allowNavigation = mode === 'view' && !onClickCallback;
	return (
		<>
			{children({
				onClick: allowNavigation ? undefined : onClick,
			})}
		</>
	);
};

/**
 *
 * @param SmartCardComponent
 * @param UnsupportedComponent
 * @example
 */
export function Card(
	SmartCardComponent: React.ComponentType<
		React.PropsWithChildren<SmartCardProps & { id?: string }>
	>,
	UnsupportedComponent: React.ComponentType<React.PropsWithChildren<unknown>>,
): React.ComponentType<React.PropsWithChildren<CardProps>> {
	return class extends React.Component<CardProps> {
		state = {
			isError: false,
		};

		render() {
			const { pluginInjectionApi, onClickCallback } = this.props;

			const { url } = titleUrlPairFromNode(this.props.node);
			if (url && !isSafeUrl(url)) {
				return <UnsupportedComponent />;
			}

			if (this.state.isError) {
				if (url) {
					return fg('dst-a11y__replace-anchor-with-link__linking-platfo') ? (
						<Link
							href={url}
							onClick={(e) => {
								e.preventDefault();
							}}
						>
							{url}
						</Link>
					) : (
						// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
						<a
							href={url}
							onClick={(e) => {
								e.preventDefault();
							}}
						>
							{url}
						</a>
					);
				} else {
					return <UnsupportedComponent />;
				}
			}

			const editorAppearance = getPluginState(this.props.view.state)?.editorAppearance;
			const analyticsEditorAppearance = getAnalyticsEditorAppearance(editorAppearance);

			return (
				<AnalyticsContext
					data={{
						attributes: { location: analyticsEditorAppearance },
						// Below is added for the future implementation of Linking Platform namespaced analytics context
						location: analyticsEditorAppearance,
					}}
				>
					<WithClickHandler
						pluginInjectionApi={pluginInjectionApi}
						onClickCallback={onClickCallback}
						url={url}
					>
						{({ onClick }) => (
							<WithCardContext>
								{(cardContext) => (
									<SmartCardComponent
										key={url}
										cardContext={cardContext}
										// Ignored via go/ees005
										// eslint-disable-next-line react/jsx-props-no-spreading
										{...this.props}
										onClick={onClick}
									/>
								)}
							</WithCardContext>
						)}
					</WithClickHandler>
				</AnalyticsContext>
			);
		}

		componentDidCatch(error: Error | APIError) {
			const maybeAPIError = error as APIError;
			// NB: errors received in this component are propagated by the `@atlaskit/smart-card` component.
			// Depending on the kind of error, the expectation for this component is to either:
			// (1) Render a blue link whilst retaining `inlineCard` in the ADF (non-fatal errs);
			// (2) Render a blue link whilst downgrading to `link` in the ADF (fatal errs).

			if (maybeAPIError.kind && maybeAPIError.kind === 'fatal') {
				this.setState({ isError: true });
				const { view, node, getPos, pluginInjectionApi } = this.props;
				const { url } = titleUrlPairFromNode(node);
				if (!getPos || typeof getPos === 'boolean') {
					return;
				}

				const pos = getPos();

				/**
				 * We cache fatal errors by position to avoid retrying the same errors
				 * on the same links at the same position.
				 */
				if (
					url &&
					pos &&
					fatalErrorPositionMap.get(url) === pos &&
					fg('platform_editor_ai_generic_prep_for_aifc_2')
				) {
					return null;
				}
				changeSelectedCardToLinkFallback(
					undefined,
					url,
					true,
					node,
					getPos(),
					pluginInjectionApi?.analytics?.actions,
				)(view.state, view.dispatch);
				if (url && pos && fg('platform_editor_ai_generic_prep_for_aifc_2')) {
					fatalErrorPositionMap.set(url, pos);
				}
				return null;
			} else {
				// Otherwise, render a blue link as fallback (above in render()).
				this.setState({ isError: true });
			}
		}
	};
}
