import React, { type ComponentType } from 'react';

import { IntlProvider, type WrappedComponentProps } from 'react-intl-next';

/**
 * HOC to wrap component with IntlProvider if not available
 */
const withIntlProvider =
	<P,>(Component: ComponentType<P>) =>
	(props: P & WrappedComponentProps): React.JSX.Element => {
		const content = <Component {...props} />;
		return props?.intl ? content : <IntlProvider locale="en">{content}</IntlProvider>;
	};

export default withIntlProvider;
