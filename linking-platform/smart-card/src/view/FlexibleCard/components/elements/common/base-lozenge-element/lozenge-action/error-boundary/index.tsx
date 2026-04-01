import React, { type ComponentType, useMemo } from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import Lozenge from '@atlaskit/lozenge';

import type { LozengeActionProps } from '../types';

const withErrorBoundary =
	(Component: ComponentType<LozengeActionProps>) =>
	(props: LozengeActionProps): React.JSX.Element => {
		const fallback = useMemo(
			() => (
				<Lozenge
					appearance={props?.appearance}
					isBold={true}
					testId={`${props?.testId ?? 'smart-element-lozenge-action'}-fallback`}
					trailingMetric={props?.trailingMetric}
				>
					{props?.text}
				</Lozenge>
			),
			[props?.appearance, props?.testId, props?.text, props?.trailingMetric],
		);

		return (
			<ErrorBoundary fallback={fallback}>
				<Component {...props} />
			</ErrorBoundary>
		);
	};

export default withErrorBoundary;
