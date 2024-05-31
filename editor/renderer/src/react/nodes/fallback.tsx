import React from 'react';
import { InlineCard } from './';
import { isSafeUrl } from '@atlaskit/adf-schema';
import { LazyLoadedDatasourceRenderFailedAnalyticsWrapper } from '@atlaskit/link-datasource';

export type CardErrorBoundaryProps = {
	unsupportedComponent: React.ComponentType<React.PropsWithChildren<unknown>>;
};

export class CardErrorBoundary extends React.PureComponent<
	{
		url?: string;
		onClick?: (e: React.MouseEvent<HTMLElement>, url?: string) => void;
		isDatasource?: boolean;
		children?: React.ReactNode;
		// Only used in Sentry tagging
		datasourceId?: string;
	} & CardErrorBoundaryProps
> {
	state = {
		isError: false,
		error: null,
	};

	onClickFallback = (e: React.MouseEvent<HTMLElement>) => {
		const { onClick, url } = this.props;
		e.preventDefault();

		if (onClick) {
			onClick(e, url);
		}
	};

	static getDerivedStateFromError(error: Error) {
		return { isError: true, error };
	}

	render() {
		if (this.state.isError) {
			const {
				url,
				isDatasource,
				unsupportedComponent: UnsupportedComponent,
				datasourceId,
			} = this.props;
			if (url) {
				const fallback = (
					<a href={url} onClick={this.onClickFallback}>
						{url}
					</a>
				);

				if (isDatasource) {
					if (isSafeUrl(url)) {
						return (
							<LazyLoadedDatasourceRenderFailedAnalyticsWrapper
								datasourceId={datasourceId}
								error={this.state.error}
							>
								<InlineCard {...this.props} />
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

	componentDidCatch(_error: Error) {
		this.setState({ isError: true, error: _error });
	}
}
