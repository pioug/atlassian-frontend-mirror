/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { memo } from 'react';

import { css, jsx } from '@compiled/react';
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

const fixedWidthContainerStyles = css({
	width: 'var(--link-picker-width)',
});

const FixedWidthContainer = (props: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			css={fixedWidthContainerStyles}
			{...(fg('platform-link-picker-a11y-label')
				? {
						role: 'dialog',
						'aria-modal': 'false',
						'aria-label': 'link-picker',
					}
				: {})}
			{...props}
		/>
	);
};

export const composeLinkPicker = (Component: React.ComponentType<LinkPickerProps>) => {
	return memo((props: LinkPickerProps) => {
		const { component } = props;
		const RootComponent = component ?? DefaultRootComponent;

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
							<FixedWidthContainer>
								<ErrorBoundary>
									<LazySuspense
										fallback={
											<LoaderFallback
												url={props.url}
												hideDisplayText={props.hideDisplayText}
												isLoadingPlugins={props.isLoadingPlugins}
												plugins={props.plugins}
											/>
										}
									>
										<RootComponent {...props} data-testid={testIds.linkPickerRoot}>
											<Component {...props} />
										</RootComponent>
									</LazySuspense>
								</ErrorBoundary>
							</FixedWidthContainer>
						</div>
					</MessagesProvider>
				</LinkPickerSessionProvider>
			</AnalyticsContext>
		);
	});
};
