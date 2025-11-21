import React from 'react';
import { IntlProvider } from 'react-intl-next';
import CategorySelector from '../src/components/picker/CategorySelector';

export default function Example(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<CategorySelector />
		</IntlProvider>
	);
}
