import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';
import React from 'react';
import { InlineCard } from './';
import { isSafeUrl } from '@atlaskit/adf-schema';
import { LazyLoadedDatasourceRenderFailedAnalyticsWrapper } from '@atlaskit/link-datasource';

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
		url?: string;
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
				const fallback = fg('dst-a11y__replace-anchor-with-link__editor') ? (
					<Link href={url} onClick={this.onClickFallback}>
						{url}
					</Link>
				) : (
					// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
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

	componentDidCatch(_error: Error) {
		this.setState({ isError: true, error: _error });
	}
}
