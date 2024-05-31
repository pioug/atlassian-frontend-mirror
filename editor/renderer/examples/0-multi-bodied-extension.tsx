import React from 'react';

import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { getExampleExtensionProviders } from '@atlaskit/editor-test-helpers/example-helpers';
import { default as Renderer } from '../src/ui/Renderer';
import adf from './helper/multi-bodied-extension-demo.adf.json';
import { createRendererWindowBindings } from './helper/testing-setup';

const dataProviders = ProviderFactory.create({
	extensionProvider: Promise.resolve(getExampleExtensionProviders(undefined)),
});

export default function Example() {
	createRendererWindowBindings(window);
	return (
		<div id="renderer-container">
			<Renderer
				document={adf}
				adfStage="stage0"
				extensionHandlers={extensionHandlers}
				dataProviders={dataProviders}
				appearance="full-page"
			/>
		</div>
	);
}
