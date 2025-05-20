/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { IntlProvider } from 'react-intl-next';

import { DocNode } from '@atlaskit/adf-schema';
import { Code } from '@atlaskit/code';
import { isSSR } from '@atlaskit/editor-common/core-utils';
import { FullPageEditor } from '@atlaskit/editor-core/appearance-editor-full-page';
import SectionMessage, { SectionMessageAction } from '@atlaskit/section-message';

// eslint-disable-next-line @atlassian/tangerine/import/no-relative-package-imports
import { useConfluenceFullPagePreset } from '../../editor-examples-helpers/src/presets/useConfluenceFullPagePreset';

export const getSSRAdf = (): DocNode | undefined => {
	try {
		return require('../example-helpers/example-data/ssr-adf.json') as DocNode;
	} catch (e) {
		return undefined;
	}
}

const FullPageSSRExample = () => {
	const { preset } = useConfluenceFullPagePreset();
	return (
		<div>
			{(getSSRAdf() === undefined) && (
				<SectionMessage
					title="SSR ADF not found"
					appearance="error"
				>
					<p>
						create your own ssr-adf.json file in <Code>packages/editor/editor-core/example-helpers/example-data/ssr-adf.json</Code>
					</p>
				</SectionMessage>
			)}
			<SectionMessage
				title="How to use this example"
				actions={
					<SectionMessageAction href="https://hello.atlassian.net/wiki/x/cXEAPAE">Usage Guide for further info and additional caveats</SectionMessageAction>
				}
			>
				<p>
					This example will simulate Conflunce SSR locally. It must be run under <Code>yarn start:rspack:ssr editor-core</Code> to work, where it will render server side then through editor in browser.
				</p>
				<p>
					debug <Code>isSSR</Code> value: {isSSR() ? 'true' : 'false'}
				</p>
			</SectionMessage>
			<IntlProvider locale="en">
				<FullPageEditor appearance='full-page' preset={preset} defaultValue={getSSRAdf()} />
			</IntlProvider>
		</div>
	);
}

export default FullPageSSRExample;
