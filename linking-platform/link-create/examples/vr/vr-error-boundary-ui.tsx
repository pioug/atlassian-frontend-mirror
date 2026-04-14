import React from 'react';

import { IntlProvider } from 'react-intl';

import { ErrorBoundaryUI } from '../../src/common/ui/error-boundary-ui';

const createExample = (): React.ComponentType => {
	return function Example() {
		return (
			<IntlProvider locale="en">
				<ErrorBoundaryUI />
			</IntlProvider>
		);
	};
};

export const DefaultErrorBoundary: React.ComponentType<{}> = createExample();
