import React, { useMemo } from 'react';

import { IntlProvider, useIntl } from 'react-intl';

import { useConfluenceFullPagePreset } from '@af/editor-examples-helpers/example-presets';
import { getExamplesProviders } from '@af/editor-examples-helpers/utils';
import type { DocNode } from '@atlaskit/adf-schema/doc';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import CardClient from '@atlaskit/link-provider/client';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';

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
	return (): React.JSX.Element => {
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
