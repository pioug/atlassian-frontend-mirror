import React from 'react';
import RendererDemo from './helper/RendererDemo';
import { createSchema } from '@atlaskit/adf-schema';
import { defaultSchemaConfig } from '@atlaskit/adf-schema/schema-default';

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
