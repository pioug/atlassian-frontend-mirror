import type { ADFEntity } from '@atlaskit/adf-utils/types';

export type BlockTransformContext = {
	source: ADFEntity;
	targetTypeName: ADFEntity['type'];
};

export type BlockTransformResult = {
	output: readonly [ADFEntity, ...ADFEntity[]];
};

export type BlockTransformExtension = {
	isSupported: (context: BlockTransformContext) => boolean;
	key: string;
	transform: (context: BlockTransformContext) => BlockTransformResult | null;
};
