import React from 'react';

import { isSafeUrl } from '@atlaskit/adf-schema/is-safe-url';
import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import { ACTION_SUBJECT_ID } from '@atlaskit/editor-common/analytics/types/enums';
import { LazyLoadedDatasourceRenderFailedAnalyticsWrapper } from '@atlaskit/link-datasource/analytics/render-failed';
import Link from '@atlaskit/link/link';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import { ACTION_SUBJECT } from '../../analytics/enums';
import { ErrorBoundary } from '../../ui/Renderer/ErrorBoundary';
import { InlineCard } from './';

function DatasourceFailureReporter({
	datasourceId,
	error,
}: {
	datasourceId?: string;
	error: unknown;
}) {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	return (
		<ErrorBoundary
			component={ACTION_SUBJECT.RENDERER}
			componentId={ACTION_SUBJECT_ID.CARD_BLOCK}
			additionalInfo="Datasource recovery analytics: "
			createAnalyticsEvent={createAnalyticsEvent}
			fallbackComponent={null}
		>
			<LazyLoadedDatasourceRenderFailedAnalyticsWrapper datasourceId={datasourceId} error={error} />
		</ErrorBoundary>
	);
}

type CardErrorBoundaryProps = {
	unsupportedComponent: React.ComponentType<React.PropsWithChildren<unknown>>;
};

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export class CardErrorBoundary extends React.PureComponent<
	{
		children?: React.ReactNode;
		// Only used in Sentry tagging
		datasourceId?: string;
		isDatasource?: boolean;
		onClick?: (e: React.MouseEvent<HTMLElement>, url?: string) => void;
		onSetLinkTarget?: (url: string) => '_blank' | undefined;
		url?: string;
	} & CardErrorBoundaryProps
> {
	state = {
		isError: false,
		error: null,
	};

	onClickFallback = (e: React.MouseEvent<HTMLElement>): void => {
		const { onClick, url } = this.props;
		e.preventDefault();

		if (onClick) {
			onClick(e, url);
		}
	};

	static getDerivedStateFromError(error: Error): {
		error: Error;
		isError: boolean;
	} {
		return { isError: true, error };
	}

	renderLink(url: string, onClick?: React.MouseEventHandler<HTMLElement>): React.JSX.Element {
		const { onSetLinkTarget } = this.props;
		let target;
		try {
			target = onSetLinkTarget?.(url);
		} catch {
			// Consumers can reject URLs they cannot parse.
		}
		return (
			<Link
				href={url}
				onClick={onClick}
				target={target === '_blank' ? target : undefined}
				rel={target === '_blank' ? 'noreferrer noopener' : undefined}
			>
				{url}
			</Link>
		);
	}

	render():
		| string
		| number
		| boolean
		| Iterable<React.ReactNode>
		| React.JSX.Element
		| null
		| undefined {
		// Include healthy datasource tables in the experiment's guardrail metrics.
		const recoverDatasourceWithLink =
			this.props.isDatasource && isExperimentEnabled('platform_editor_optional_chunk_recovery');
		if (this.state.isError) {
			const {
				url,
				isDatasource,
				unsupportedComponent: UnsupportedComponent,
				datasourceId,
			} = this.props;
			if (recoverDatasourceWithLink) {
				return (
					<>
						{url && isSafeUrl(url) ? (
							this.renderLink(url, this.props.onClick ? this.onClickFallback : undefined)
						) : (
							<UnsupportedComponent />
						)}
						<DatasourceFailureReporter datasourceId={datasourceId} error={this.state.error} />
					</>
				);
			}
			if (url) {
				const fallback = this.renderLink(url, this.onClickFallback);
				if (isDatasource) {
					if (isSafeUrl(url)) {
						return (
							<LazyLoadedDatasourceRenderFailedAnalyticsWrapper
								datasourceId={datasourceId}
								error={this.state.error}
							>
								<InlineCard
									// Ignored via go/ees005
									// eslint-disable-next-line react/jsx-props-no-spreading
									{...this.props}
								/>
							</LazyLoadedDatasourceRenderFailedAnalyticsWrapper>
						);
					} else {
						return (
							<LazyLoadedDatasourceRenderFailedAnalyticsWrapper
								datasourceId={datasourceId}
								error={this.state.error}
							>
								{fallback}
							</LazyLoadedDatasourceRenderFailedAnalyticsWrapper>
						);
					}
				} else {
					return fallback;
				}
			} else {
				return <UnsupportedComponent />;
			}
		}

		return this.props.children;
	}

	componentDidCatch(_error: Error): void {
		this.setState({ isError: true, error: _error });
	}
}
