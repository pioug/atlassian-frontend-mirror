import React, { useMemo } from 'react';

import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { getExamplesProviders } from '@af/editor-examples-helpers/utils';
import { useConfluenceFullPagePreset } from '@af/editor-examples-helpers/example-presets';
import { IntlProvider, useIntl } from 'react-intl-next';
import type { DocNode } from '@atlaskit/adf-schema';
import { EditorSSRRenderer } from '../src';

class SSRPortalProviderAPI implements PortalProviderAPI {
	destroy() {}
	remove() {}
	render() {}
}

function SSREditor({ adf }: { adf: DocNode }) {
	const intl = useIntl();
	const providers = useMemo(() => getExamplesProviders({ sanitizePrivateContent: true }), []);

	const { preset } = useConfluenceFullPagePreset({
		editorAppearance: 'full-page',
		overridedFullPagePresetProps: {
			providers,
		},
	});

	return (
		<EditorSSRRenderer
			intl={intl}
			doc={PMNode.fromJSON(defaultSchema, adf)}
			plugins={preset.build({})}
			schema={defaultSchema}
			portalProviderAPI={new SSRPortalProviderAPI()}
			id="ak-editor-textarea"
			data-editor-id="6f03e411-00a8-448b-bbc0-66f350895a5e"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="ProseMirror ua-chrome"
			aria-label="Main content area, start typing to enter text."
		/>
	);
}

export function createExample(adf: DocNode) {
	return () => {
		const smartCardClient = useMemo(() => new CardClient('staging'), []);

		return (
			<IntlProvider locale={'en'}>
				<SmartCardProvider client={smartCardClient}>
					<SSREditor adf={adf} />
				</SmartCardProvider>
			</IntlProvider>
		);
	};
}
