import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { token } from '@atlaskit/tokens';

import { MacroFallbackCard } from '../src/ui';

export default function MacroFallbackCardErrorExample() {
	return (
		<IntlProvider locale="en">
			<div style={{ padding: `${token('space.600', '48px')}` }}>
				<MacroFallbackCard
					macroName="Macro Name"
					extensionKey="toc"
					action="Cancel"
					loading={false}
					errorMessage="Something bad happened"
					secondaryAction="Abort"
				/>
			</div>
		</IntlProvider>
	);
}
