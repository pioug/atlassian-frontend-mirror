import React from 'react';

import { IntlProvider } from 'react-intl-next';

interface ErrorBoundaryProps {
	children?: React.ReactNode;
}

interface ErrorBoundaryState {
	missingIntlProviderInAncestry: boolean;
}

export const REACT_INTL_ERROR_MESSAGE = '<IntlProvider> needs to exist in the component ancestry';

const isMissingIntlProviderInAncestryError = (err: Error) =>
	err?.toString()?.includes('<IntlProvider> needs to exist in the component ancestry');

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export class IntlErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state = {
		missingIntlProviderInAncestry: false,
	};

	componentDidCatch(error: Error, _errorInfo: React.ErrorInfo): void {
		// if missing IntlProvider in ancestry, we setup a fallback IntlProvider ourselves
		if (isMissingIntlProviderInAncestryError(error)) {
			this.setState({ missingIntlProviderInAncestry: true });
		} else {
			// else we re-propagate the non-react-intl-next error
			throw error;
		}
	}

	render() {
		if (this.state.missingIntlProviderInAncestry) {
			return <IntlProvider locale="en">{this.props.children}</IntlProvider>;
		}
		return this.props.children;
	}
}
