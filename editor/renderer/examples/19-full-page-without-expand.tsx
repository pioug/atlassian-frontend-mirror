import React from 'react';

import { createSchema } from '@atlaskit/adf-schema/create-schema';
import { defaultSchemaConfig } from '@atlaskit/adf-schema/schema-default';

import RendererDemo from './helper/RendererDemo';

const schemaWithoutExpand = createSchema({
	nodes: defaultSchemaConfig.nodes.filter((node) => node !== 'expand'),
});

export default function Example(): React.JSX.Element {
	return (
		<RendererDemo
			appearance="full-page"
			serializer="react"
			allowHeadingAnchorLinks
			allowColumnSorting={true}
			schema={schemaWithoutExpand}
		/>
	);
}
