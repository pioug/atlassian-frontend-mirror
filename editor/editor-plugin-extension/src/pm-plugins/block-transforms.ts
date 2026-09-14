import type { BlockTransformExtension } from '@atlaskit/editor-common/block-menu/block-transform-extension';
import type { ExtensionManifest } from '@atlaskit/editor-common/extensions/extension-manifest';

export const buildExtensionBlockTransforms = (
	manifests: ExtensionManifest[],
): BlockTransformExtension[] => {
	const transforms: BlockTransformExtension[] = [];

	for (const manifest of manifests) {
		for (const nodeModule of Object.values(manifest.modules.nodes ?? {})) {
			if (nodeModule.blockTransform) {
				transforms.push(nodeModule.blockTransform);
			}
		}
	}

	return transforms;
};
