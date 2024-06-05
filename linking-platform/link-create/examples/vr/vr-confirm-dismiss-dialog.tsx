import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { ConfirmDismissDialog } from '../../src/common/ui/confirm-dismiss-dialog';

const createExample = (): React.ComponentType => {
	return function Example() {
		return (
			<IntlProvider locale="en">
				<ConfirmDismissDialog active={true} onClose={() => {}} onCancel={() => {}} />
			</IntlProvider>
		);
	};
};

export const DefaultConfirmDismissDialog = createExample();
