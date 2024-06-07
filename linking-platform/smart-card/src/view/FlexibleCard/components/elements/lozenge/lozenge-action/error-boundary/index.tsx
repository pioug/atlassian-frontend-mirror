import React, { useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Lozenge from '@atlaskit/lozenge';
import type { ComponentType, FC } from 'react';
import type { LozengeActionProps } from '../types';

const withErrorBoundary =
	(Component: ComponentType<LozengeActionProps>): FC<LozengeActionProps> =>
	(props) => {
		const fallback = useMemo(
			() => (
				<Lozenge
					appearance={props?.appearance}
					testId={`${props?.testId ?? 'smart-element-lozenge-action'}-fallback`}
				>
					{props?.text}
				</Lozenge>
			),
			[props?.appearance, props?.testId, props?.text],
		);

		return (
			<ErrorBoundary fallback={fallback}>
				<Component {...props} />
			</ErrorBoundary>
		);
	};

export default withErrorBoundary;
