import { isSafeUrl } from '@atlaskit/adf-schema';
import Link from '@atlaskit/link';
import { LazyLoadedDatasourceRenderFailedAnalyticsWrapper } from '@atlaskit/link-datasource';
import { fg } from '@atlaskit/platform-feature-flags';
import React from 'react';
import { InlineCard } from './';

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
				onSetLinkTarget,
			} = this.props;
			if (url) {
				let actualTarget;

				if (onSetLinkTarget && fg('rovo_chat_deep_linking_enabled')) {
					try {
						actualTarget = onSetLinkTarget(url);
					} catch {
						// If URL parsing fails, use the original target
					}
				}

				const linkProps = {
					href: url,
					onClick: this.onClickFallback,
					...(actualTarget === '_blank' && { target: '_blank', rel: 'noreferrer noopener' }),
				};

				const fallback = fg('dst-a11y__replace-anchor-with-link__editor') ? (
					<Link
						href={linkProps.href}
						onClick={linkProps.onClick}
						target={linkProps.target}
						rel={linkProps.rel}
					>
						{url}
					</Link>
				) : (
					// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
					<a
						href={linkProps.href}
						onClick={linkProps.onClick}
						target={linkProps.target}
						rel={linkProps.rel}
					>
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

	componentDidCatch(_error: Error): void {
		this.setState({ isError: true, error: _error });
	}
}
