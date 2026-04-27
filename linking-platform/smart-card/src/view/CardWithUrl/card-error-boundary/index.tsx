import React from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import type { CardProps } from '../../Card';
import { LoadingCardLink } from '../component-lazy/LoadingCardLink';

type CardErrorBoundaryProps = CardProps & Required<Pick<CardProps, 'id' | 'url'>>;
const CardErrorBoundary = ({
	children,
	...props
}: React.PropsWithChildren<CardErrorBoundaryProps>): React.JSX.Element => {
	// TODO: NAVX-4682: Add feature parity to CardWithURLRenderer
	const ErrorFallbackComponent = props.fallbackComponent;

	const errorBoundaryFallbackComponent = () => {
		if (ErrorFallbackComponent) {
			return <ErrorFallbackComponent />;
		}

		return <LoadingCardLink {...props} />;
	};

	return (
		<ErrorBoundary FallbackComponent={errorBoundaryFallbackComponent}>{children}</ErrorBoundary>
	);
};

export default CardErrorBoundary;
