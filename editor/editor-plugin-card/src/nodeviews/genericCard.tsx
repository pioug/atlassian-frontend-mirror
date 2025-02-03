import React, { useCallback } from 'react';
import type { EventHandler, KeyboardEvent, MouseEvent } from 'react';

import { isSafeUrl } from '@atlaskit/adf-schema';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { OnClickCallback } from '@atlaskit/editor-common/card';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { getPosHandler, ReactComponentProps } from '@atlaskit/editor-common/react-node-view';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { getAnalyticsEditorAppearance } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
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

export interface CardNodeViewProps extends ReactComponentProps {
	providerFactory?: ProviderFactory;
	eventDispatcher?: EventDispatcher;
}

export interface CardProps extends CardNodeViewProps {
	children?: React.ReactNode;
	node: PMNode;
	view: EditorView;
	getPos: getPosHandler;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	eventDispatcher?: EventDispatcher;
	allowResizing?: boolean;
	fullWidthMode?: boolean;
	useAlternativePreloader?: boolean;
	actionOptions?: BaseCardProps['actionOptions'];
	pluginInjectionApi?: ExtractInjectionAPI<typeof cardPlugin>;
	onClickCallback?: OnClickCallback;
	showHoverPreview?: BaseCardProps['showHoverPreview'];
	hoverPreviewOptions?: BaseCardProps['hoverPreviewOptions'];
	__livePage?: boolean;
}

export interface SmartCardProps extends CardProps {
	pluginInjectionApi?: ExtractInjectionAPI<typeof cardPlugin>;
	cardContext?: EditorContext<CardContext | undefined>;
	onClick?: EventHandler<MouseEvent | KeyboardEvent> | undefined;
	onResolve?: (tr: Transaction, title?: string) => void;
	isHovered?: boolean;
	allowEmbeds?: boolean;
	allowBlockCards?: boolean;
	enableInlineUpgradeFeatures?: boolean;
}

const WithClickHandler = ({
	pluginInjectionApi,
	url,
	onClickCallback,
	children,
	__livePage,
}: {
	pluginInjectionApi: ExtractInjectionAPI<CardPlugin> | undefined;
	onClickCallback?: OnClickCallback;
	url?: string;
	children: (props: {
		onClick: ((e: React.MouseEvent<HTMLAnchorElement>) => void) | undefined;
	}) => React.ReactNode;
	__livePage?: boolean;
}) => {
	const { editorViewModeState } = useSharedPluginState(pluginInjectionApi, ['editorViewMode']);

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

	if (fg('linking_platform_smart_links_in_live_pages')) {
		/**
		 * @todo: Add a check to determine if we're currently in a live page once ED-23920 and plugin
		 * is complete. The logic for which should allow navigation if we're in a live page and no callback
		 * has been provided. E.g.
		 *
		 * const allowNavigation = isLivePage && !onClickCallback;
		 */
		const allowNavigation = __livePage && !onClickCallback;

		return (
			<>
				{children({
					onClick: allowNavigation ? undefined : onClick,
				})}
			</>
		);
	}

	// Setting `onClick` to `undefined` ensures clicks on smartcards navigate to the URL.
	// If in view mode and not overriding with onClickCallback option, then allow smartlinks to navigate on click.
	const allowNavigation = editorViewModeState?.mode === 'view' && !onClickCallback;
	return (
		<>
			{children({
				onClick: allowNavigation ? undefined : onClick,
			})}
		</>
	);
};

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
					return (
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
						__livePage={this.props.__livePage}
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
				changeSelectedCardToLinkFallback(
					undefined,
					url,
					true,
					node,
					getPos(),
					pluginInjectionApi?.analytics?.actions,
				)(view.state, view.dispatch);
				return null;
			} else {
				// Otherwise, render a blue link as fallback (above in render()).
				this.setState({ isError: true });
			}
		}
	};
}
