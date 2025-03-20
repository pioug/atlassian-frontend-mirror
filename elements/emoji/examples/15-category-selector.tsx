import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { default as EmotionCategorySelector } from '../src/components/picker/CategorySelector';
import { default as CompiledCategorySelector } from '../src/components/compiled/picker/CategorySelector';
import { fg } from '@atlaskit/platform-feature-flags';

export default function Example() {
	return (
		<IntlProvider locale="en">
			{fg('platform_editor_css_migrate_emoji') ? (
				<CompiledCategorySelector />
			) : (
				<EmotionCategorySelector />
			)}
		</IntlProvider>
	);
}
