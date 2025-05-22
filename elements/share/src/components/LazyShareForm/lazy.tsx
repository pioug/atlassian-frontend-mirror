/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type FunctionComponent, lazy, Suspense } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
import Spinner from '@atlaskit/spinner';

import { ShareFormWrapper } from '../ShareFormWrapper';

import ComponentNext from './lazyNext';
import type { LazyShareFormProps } from './LazyShareForm';

const spinnerWrapperStyles = css({
	width: '100%',
	height: '100%',
	display: 'flex',
	justifyContent: 'center',
	alignContent: 'center',
});

const LazyShareFormLazy = lazy<FunctionComponent<LazyShareFormProps>>(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_share-form" */
			'./LazyShareForm'
		),
);

type LoadingDialog = Pick<
	LazyShareFormProps,
	| 'shareFormTitle'
	| 'showTitle'
	| 'setIsLoading'
	| 'integrationMode'
	| 'isMenuItemSelected'
	| 'isExtendedShareDialogEnabled'
>;

const LoadingDialog: React.FC<LoadingDialog> = ({
	shareFormTitle,
	showTitle,
	setIsLoading,
	integrationMode,
	isMenuItemSelected,
	isExtendedShareDialogEnabled,
}) => {
	React.useEffect(() => {
		setIsLoading(true);
	});

	return (
		<ShareFormWrapper
			shareFormTitle={shareFormTitle}
			integrationMode={integrationMode}
			isMenuItemSelected={isMenuItemSelected}
			// if `showTitle` is passed, we use it. Otherwise, we will show title for loading dialog.
			shouldShowTitle={typeof showTitle === 'boolean' ? showTitle : true}
			isExtendedShareDialogEnabled={isExtendedShareDialogEnabled}
		>
			<div css={spinnerWrapperStyles}>
				<Spinner />
			</div>
		</ShareFormWrapper>
	);
};

export default (props: LazyShareFormProps) =>
	fg('share-compiled-migration') ? (
		<ComponentNext {...props} />
	) : (
		<Suspense
			fallback={
				<LoadingDialog
					shareFormTitle={props.shareFormTitle}
					showTitle={props.showTitle}
					setIsLoading={props.setIsLoading}
					integrationMode={props.integrationMode}
					isMenuItemSelected={props.isMenuItemSelected}
					isExtendedShareDialogEnabled={props.isExtendedShareDialogEnabled}
				/>
			}
		>
			<LazyShareFormLazy {...props} />
		</Suspense>
	);
