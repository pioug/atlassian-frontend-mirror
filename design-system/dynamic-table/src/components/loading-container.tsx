import React from 'react';

import Spinner from '@atlaskit/spinner';

import { LARGE, LOADING_CONTENTS_OPACITY } from '../internal/constants';
import { Container, ContentsContainer, SpinnerContainer } from '../styled/loading-container';
import type { SpinnerSizeType } from '../types';

interface LoadingContainerProps {
	children: React.ReactNode;
	isLoading?: boolean;
	spinnerSize?: SpinnerSizeType;
	contentsOpacity: number;
	testId?: string;
	loadingLabel?: string;
}

export default class LoadingContainer extends React.Component<LoadingContainerProps> {
	static defaultProps = {
		isLoading: true,
		spinnerSize: LARGE,
		contentsOpacity: LOADING_CONTENTS_OPACITY,
		loadingLabel: 'Loading table',
	};

	render() {
		const { children, isLoading, spinnerSize, contentsOpacity, testId, loadingLabel } = this.props;

		return (
			<Container testId={testId}>
				{!isLoading ? (
					children
				) : (
					<ContentsContainer contentsOpacity={contentsOpacity} testId={testId}>
						{children}
					</ContentsContainer>
				)}
				{isLoading && (
					<SpinnerContainer testId={testId}>
						<Spinner
							size={spinnerSize}
							testId={testId && `${testId}--loadingSpinner`}
							label={loadingLabel}
						/>
					</SpinnerContainer>
				)}
			</Container>
		);
	}
}
