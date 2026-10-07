/* eslint-disable @atlaskit/editor/no-re-export */
import ReactSerializerCore, { type ReactSerializerInit } from '../react';
import { nodes } from '../react/nodes/nodes';

export type { Serializer } from '../serializer';
export type { ReactSerializerInit } from '../react';

export class ReactSerializer extends ReactSerializerCore {
	constructor(init: ReactSerializerInit) {
		super({
			...init,
			nodeComponents: {
				...nodes,
				...init.nodeComponents,
			},
		});
	}
}
