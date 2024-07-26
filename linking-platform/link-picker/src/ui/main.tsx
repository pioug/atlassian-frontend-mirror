/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment, memo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { LazySuspense } from 'react-loosely-lazy';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { COMPONENT_NAME, LINK_PICKER_WIDTH_IN_PX } from '../common/constants';
import type { LinkPickerProps } from '../common/types';
import type { PackageMetaDataType } from '../common/utils/analytics/analytics.codegen';
import { LinkPickerSessionProvider } from '../controllers/session-provider';

import { ErrorBoundary } from './error-boundary';
import { LoaderFallback } from './loader-fallback';
import { MessagesProvider } from './messages-provider';
import { fixedWidthContainerStyles } from './styled';

export const testIds = {
	linkPickerRoot: 'link-picker-root',
};

export const PACKAGE_DATA: PackageMetaDataType = {
	packageName: process.env._PACKAGE_NAME_ || '',
	packageVersion: process.env._PACKAGE_VERSION_ || '',
	componentName: COMPONENT_NAME,
	source: COMPONENT_NAME,
};

const DefaultRootComponent = ({
	children,
}: Omit<React.HTMLAttributes<HTMLDivElement>, 'onSubmit'> & LinkPickerProps) => {
	return <div data-testid={testIds.linkPickerRoot}>{children}</div>;
};

const FixedWidthContainer = (props: React.HTMLAttributes<HTMLDivElement>) => {
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
	return <div css={fixedWidthContainerStyles} {...props} />;
};

export const composeLinkPicker = (Component: React.ComponentType<LinkPickerProps>) => {
	return memo((props: LinkPickerProps) => {
		const { component } = props;
		const RootComponent = component ?? DefaultRootComponent;

		/**
		 * When ff enabled: root container will provide width to component + loader + error boundary
		 * When ff disabled: component + loader + error boundary each providing their own width
		 * Cannot make this change easier at risk of regression as external adopters may have css override on the form element
		 */
		const RootFixedWidthContainer = fg(
			'platform.linking-platform.link-picker.fixed-height-search-results',
		)
			? FixedWidthContainer
			: Fragment;
		const LoaderFallbackContainer = fg(
			'platform.linking-platform.link-picker.fixed-height-search-results',
		)
			? Fragment
			: FixedWidthContainer;

		return (
			<AnalyticsContext data={PACKAGE_DATA}>
				<LinkPickerSessionProvider>
					<MessagesProvider>
						<div
							style={{
								['--link-picker-width' as string]: props.disableWidth
									? '100%'
									: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
										`${LINK_PICKER_WIDTH_IN_PX}px`,
								['--link-picker-padding-left' as string]:
									props.paddingLeft ?? token('space.200', '16px'),
								['--link-picker-padding-right' as string]:
									props.paddingRight ?? token('space.200', '16px'),
								['--link-picker-padding-top' as string]:
									props.paddingTop ?? token('space.200', '16px'),
								['--link-picker-padding-bottom' as string]:
									props.paddingBottom ?? token('space.200', '16px'),
							}}
						>
							<RootFixedWidthContainer>
								<ErrorBoundary>
									<LazySuspense
										fallback={
											<LoaderFallbackContainer>
												<LoaderFallback
													url={props.url}
													hideDisplayText={props.hideDisplayText}
													isLoadingPlugins={props.isLoadingPlugins}
													plugins={props.plugins}
												/>
											</LoaderFallbackContainer>
										}
									>
										<RootComponent {...props} data-testid={testIds.linkPickerRoot}>
											<Component {...props} />
										</RootComponent>
									</LazySuspense>
								</ErrorBoundary>
							</RootFixedWidthContainer>
						</div>
					</MessagesProvider>
				</LinkPickerSessionProvider>
			</AnalyticsContext>
		);
	});
};
