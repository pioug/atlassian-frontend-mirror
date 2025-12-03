import React, { useMemo } from 'react';

import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { getExamplesProviders } from '@af/editor-examples-helpers/utils';
import { useConfluenceFullPagePreset } from '@af/editor-examples-helpers/example-presets';
import { IntlProvider } from 'react-intl-next';
import type { DocNode } from '@atlaskit/adf-schema';
import { EditorSSRRenderer } from '../src';
import EditorContentContainer from '@atlaskit/editor-core/editor-styles-container';

export function createExample(adf: DocNode) {
	return () => {
		const smartCardClient = useMemo(() => new CardClient('staging'), []);
		const providers = useMemo(() => getExamplesProviders({ sanitizePrivateContent: true }), []);

		const { preset } = useConfluenceFullPagePreset({
			editorAppearance: 'full-page',
			overridedFullPagePresetProps: {
				providers,
			},
		});

		return (
			<IntlProvider locale={'en'}>
				<EditorContentContainer>
					<SmartCardProvider client={smartCardClient}>
						<EditorSSRRenderer adf={adf} preset={preset} />;
					</SmartCardProvider>
				</EditorContentContainer>
			</IntlProvider>
		);
	};
}
