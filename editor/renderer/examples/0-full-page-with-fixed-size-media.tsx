import React from 'react';

import { IntlProvider } from 'react-intl';

import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';

import adf from './helper/media-with-fixed-size.json';
import RendererDemo from './helper/RendererDemo';

const Example = (): React.JSX.Element => {
	return (
		<IntlProvider locale="en" messages={{}}>
			<RendererDemo
				appearance="full-page"
				serializer="react"
				allowHeadingAnchorLinks
				allowColumnSorting={true}
				adfStage={'stage0'}
				schema={getSchemaBasedOnStage('stage0')}
				document={adf}
				mediaOptions={{ allowCaptions: true }}
				withProviders
			/>
		</IntlProvider>
	);
};

export default Example;
