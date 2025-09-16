import React, { type ComponentType } from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import type { HyperlinkResolverProps } from './index';

// Remove on navx-1834-refactor-resolved-hyperlink cleanup
const withErrorBoundary =
	(Component: ComponentType<HyperlinkResolverProps>) => (props: HyperlinkResolverProps) => {
		return (
			<ErrorBoundary fallback={null}>
				<Component {...props} />
			</ErrorBoundary>
		);
	};

export default withErrorBoundary;
