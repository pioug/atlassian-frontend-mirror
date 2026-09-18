import React from 'react';

import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import type { MediaOptions } from '@atlaskit/editor-plugin-media/types';

import adf from './helper/media-without-caption.adf.json';
import RendererDemo from './helper/RendererDemo';

const Example = (): React.JSX.Element => {
	const mediaOptions: MediaOptions = { allowCaptions: false };

	return (
		<RendererDemo
			appearance="full-page"
			serializer="react"
			allowHeadingAnchorLinks
			allowColumnSorting={true}
			useSpecBasedValidator={true}
			adfStage={'stage0'}
			schema={getSchemaBasedOnStage('stage0')}
			mediaOptions={mediaOptions}
			document={adf}
		/>
	);
};

export default Example;
