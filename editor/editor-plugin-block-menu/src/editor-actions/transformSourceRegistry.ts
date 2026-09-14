import type {
	BlockTransformContext,
	BlockTransformExtension,
} from '@atlaskit/editor-common/block-menu/block-transform-extension';
import { logException } from '@atlaskit/editor-common/monitoring';

type BlockMenuTransformResolution =
	| { status: 'supported'; transform: BlockTransformExtension }
	| { status: 'unsupported' };

export type BlockMenuTransformSourceRegistry = {
	register: (transforms: readonly BlockTransformExtension[]) => () => void;
	resolve: (context: BlockTransformContext) => BlockMenuTransformResolution;
};

export const createBlockMenuTransformSourceRegistry = (): BlockMenuTransformSourceRegistry => {
	const transforms = new Map<string, BlockTransformExtension>();

	return {
		register: (registeredTransforms) => {
			const registered: BlockTransformExtension[] = [];
			registeredTransforms.forEach((transform) => {
				if (transforms.has(transform.key)) {
					void logException(new Error(`Duplicate Block Menu transform key: ${transform.key}`), {
						location: 'editor-plugin-block-menu',
					});
					return;
				}

				transforms.set(transform.key, transform);
				registered.push(transform);
			});
			if (registered.length === 0) {
				return () => {};
			}

			return () => {
				registered.forEach((transform) => {
					if (transforms.get(transform.key) === transform) {
						transforms.delete(transform.key);
					}
				});
			};
		},
		resolve: (context) => {
			const transform = Array.from(transforms.values()).find(({ isSupported }) => {
				try {
					return isSupported(context);
				} catch (error) {
					void logException(
						error instanceof Error ? error : new Error('Block Menu transform support check failed'),
						{ location: 'editor-plugin-block-menu' },
					);
					return false;
				}
			});

			return transform ? { status: 'supported', transform } : { status: 'unsupported' };
		},
	};
};
