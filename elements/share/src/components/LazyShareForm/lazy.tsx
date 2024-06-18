/** @jsx jsx */
import React, { type FunctionComponent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { lazyForPaint, LazySuspense } from 'react-loosely-lazy';

import Spinner from '@atlaskit/spinner';

import { ShareFormWrapper } from '../ShareFormWrapper';

import type { LazyShareFormProps } from './LazyShareForm';

const spinnerWrapperStyles = css({
	width: '100%',
	height: '100%',
	display: 'flex',
	justifyContent: 'center',
	alignContent: 'center',
});

const LazyShareFormLazy = lazyForPaint<FunctionComponent<LazyShareFormProps>>(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_share-form" */
			'./LazyShareForm'
		),
	{ ssr: false },
);

type LoadingDialog = Pick<
	LazyShareFormProps,
	'shareFormTitle' | 'showTitle' | 'setIsLoading' | 'integrationMode' | 'isMenuItemSelected'
>;

const LoadingDialog: React.FC<LoadingDialog> = ({
	shareFormTitle,
	showTitle,
	setIsLoading,
	integrationMode,
	isMenuItemSelected,
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
		>
			<div css={spinnerWrapperStyles}>
				<Spinner />
			</div>
		</ShareFormWrapper>
	);
};

export default (props: LazyShareFormProps) => (
	<LazySuspense
		fallback={
			<LoadingDialog
				shareFormTitle={props.shareFormTitle}
				showTitle={props.showTitle}
				setIsLoading={props.setIsLoading}
				integrationMode={props.integrationMode}
				isMenuItemSelected={props.isMenuItemSelected}
			/>
		}
	>
		<LazyShareFormLazy {...props} />
	</LazySuspense>
);
