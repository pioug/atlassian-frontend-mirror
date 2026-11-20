import React from 'react';

import { IntlProvider } from 'react-intl';

import AppearanceExample from './10-appearance.vr.ap';

// Enable platform_modal_title_icon_label to hear the translated icon labels.
// Applications supply these messages in their existing React Intl catalog.
export default function LocalizedTitleExample(): React.JSX.Element {
	return (
		<IntlProvider
			locale="fr"
			messages={{
				'modal-dialog.title.warning-icon-label': 'avertissement',
				'modal-dialog.title.danger-icon-label': 'danger',
			}}
		>
			<AppearanceExample />
		</IntlProvider>
	);
}
