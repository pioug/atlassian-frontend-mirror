import React from 'react';
import { IntlProvider } from 'react-intl-next';
import CategorySelector from '../src/components/picker/CategorySelector';

export default function Example() {
	return (
		<IntlProvider locale="en">
			<CategorySelector />
		</IntlProvider>
	);
}
