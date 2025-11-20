import React, { type ComponentType, useMemo } from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import Lozenge from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';

import type { LozengeActionProps } from '../types';

const withErrorBoundary =
	(Component: ComponentType<LozengeActionProps>) =>
	(props: LozengeActionProps): React.JSX.Element => {
		const fallback = useMemo(
			() => (
				<Lozenge
					appearance={props?.appearance}
					{...(fg('platform-component-visual-refresh') ? { isBold: true } : undefined)}
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
