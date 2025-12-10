import React from 'react';
import RendererDemo from './helper/RendererDemo';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import adf from './helper/media-with-caption.adf.json';

const Example = (): React.JSX.Element => {
	return (
		<RendererDemo
			appearance="full-page"
			serializer="react"
			allowHeadingAnchorLinks
			allowColumnSorting={true}
			useSpecBasedValidator={true}
			adfStage={'stage0'}
			schema={getSchemaBasedOnStage('stage0')}
			mediaOptions={{ allowCaptions: true }}
			document={adf}
		/>
	);
};

export default Example;
