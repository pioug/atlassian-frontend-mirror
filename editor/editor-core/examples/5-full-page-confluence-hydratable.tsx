import React from 'react';

import { IntlProvider } from 'react-intl-next';

import {
	getExamplesProviders,
	useConfluenceFullPagePreset,
} from '@af/editor-examples-helpers/example-presets';
import Button from '@atlaskit/button/standard-button';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { TitleInput } from '@atlaskit/editor-test-helpers/example-helpers';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import { createCollabEditProvider } from '@atlaskit/synchrony-test-helpers';

import { hydrateAdf } from '../example-helpers/example-data/hydrate-adf';

const HydratableEditorExample = () => {
	const smartCardClient = React.useMemo(() => new CardClient('staging'), []);
	const providers = React.useMemo(() => getExamplesProviders({ sanitizePrivateContent: true }), []);
	const collabEditProvider = React.useMemo(() => {
		return createCollabEditProvider({
			userId: 'quokka',
			defaultDoc: JSON.stringify(hydrateAdf),
		});
	}, []);

	const { preset } = useConfluenceFullPagePreset({
		editorAppearance: 'full-page',
		overridedFullPagePresetProps: {
			providers,
		},
		// hasEditPermission: false, //  uncomment to enable request to edit on tasks
	});

	return (
		<IntlProvider locale={'en'}>
			<SmartCardProvider client={smartCardClient}>
				<ComposableEditor
					preset={preset}
					appearance="full-page"
					collabEdit={{ provider: collabEditProvider }}
					disabled={false}
					defaultValue={hydrateAdf}
					contentComponents={<TitleInput />}
					primaryToolbarIconBefore={
						<Button iconBefore={<AtlassianIcon />} appearance="subtle" shouldFitContainer></Button>
					}
					// eslint-disable-next-line react/jsx-props-no-spreading -- needed only for providers
					{...providers}
				/>
			</SmartCardProvider>
		</IntlProvider>
	);
};

export default HydratableEditorExample;
