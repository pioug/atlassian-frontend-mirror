import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import { buildAction } from './manifest-helpers';
import type { ExtensionManifest, ExtensionModule } from './types/extension-manifest';
import type { Parameters } from './types/extension-parameters';
import type { MenuItem } from './types/utils';

export function buildMenuItem<T extends Parameters>(
	manifest: ExtensionManifest<T>,
	extensionModule: ExtensionModule<T>,
): MenuItem {
	const title = extensionModule.title || manifest.title;
	const key = `${manifest.key}:${extensionModule.key}`;
	const node = buildAction(extensionModule.action, manifest);
	const category = isExperimentEnabled('platform_editor_slash_command')
		? (extensionModule.category ?? manifest.category)
		: undefined;
	if (!node) {
		throw new Error(`Couldn't find any action for ${title} (${key})`);
	}
	return {
		...(isExperimentEnabled('platform_editor_slash_app_category_analytics') ||
		isExperimentEnabled('platform_editor_slash_command')
			? { app: extensionModule.app ?? manifest.app ?? { key: manifest.key } }
			: {}),
		key,
		title,
		extensionType: manifest.type,
		extensionKey: manifest.key,
		keywords: extensionModule.keywords || manifest.keywords || [],
		featured: extensionModule.featured || false,
		// Keep `categories` populated for legacy Quick Insert consumers while
		// the singular category field is introduced.
		...(category?.trim() ? { category } : {}),
		categories: category?.trim()
			? [category]
			: extensionModule.categories || manifest.categories || [],
		description: extensionModule.description || manifest.description,
		summary: manifest.summary,
		documentationUrl: manifest.documentationUrl,
		priority: extensionModule.priority,
		...(extensionModule.lozenge != null && { lozenge: extensionModule.lozenge }),
		icon: extensionModule.icon || manifest.icons['48'],
		node,
	};
}
