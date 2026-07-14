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
	if (!node) {
		throw new Error(`Couldn't find any action for ${title} (${key})`);
	}
	return {
		key,
		title,
		extensionType: manifest.type,
		extensionKey: manifest.key,
		keywords: extensionModule.keywords || manifest.keywords || [],
		featured: extensionModule.featured || false,
		categories: extensionModule.categories || manifest.categories || [],
		description: extensionModule.description || manifest.description,
		summary: manifest.summary,
		documentationUrl: manifest.documentationUrl,
		priority: extensionModule.priority,
		...(extensionModule.lozenge != null && { lozenge: extensionModule.lozenge }),
		icon: extensionModule.icon || manifest.icons['48'],
		node,
	};
}
