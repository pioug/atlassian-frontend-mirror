import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

const DEPRECATED_PREFIX = '@atlaskit/navigation-system/side-nav-items';
const BARREL_ENTRYPOINT = '@atlaskit/navigation-system';
const REPLACEMENT_PREFIX = '@atlaskit/side-nav-items';

// Mapping between the side nav item exports from the barrel entrypoint, to the new subpath in @atlaskit/side-nav-items
const EXPORT_TO_ENTRYPOINT_SUBPATH: Record<string, string> = {
	ExpandableMenuItem: 'expandable-menu-item',
	ExpandableMenuItemProps: 'expandable-menu-item',
	ExpandableMenuItemTrigger: 'expandable-menu-item',
	ExpandableMenuItemTriggerProps: 'expandable-menu-item',
	ExpandableMenuItemContent: 'expandable-menu-item',
	ExpandableMenuItemContentProps: 'expandable-menu-item',
	useIsExpanded: 'expandable-menu-item',
	FlyoutMenuItem: 'flyout-menu-item',
	FlyoutMenuItemProps: 'flyout-menu-item',
	FlyoutMenuItemContent: 'flyout-menu-item',
	FlyoutMenuItemContentProps: 'flyout-menu-item',
	FlyoutMenuItemTrigger: 'flyout-menu-item',
	FlyoutMenuItemTriggerProps: 'flyout-menu-item',
	ButtonMenuItem: 'button-menu-item',
	ButtonMenuItemProps: 'button-menu-item',
	COLLAPSE_ELEM_BEFORE: 'button-menu-item',
	LinkMenuItem: 'link-menu-item',
	LinkMenuItemProps: 'link-menu-item',
	MenuListItem: 'menu-list-item',
	ContainerAvatar: 'container-avatar',
	ContainerAvatarProps: 'container-avatar',
	MenuList: 'menu-list',
	TopLevelSpacer: 'top-level-spacer',
	MenuSection: 'menu-section',
	MenuSectionHeading: 'menu-section',
	Divider: 'menu-section',
};

const rule = createLintRule({
	meta: {
		name: 'use-side-nav-items-package',
		type: 'problem',
		fixable: 'code',
		hasSuggestions: true,
		docs: {
			description:
				'Use @atlaskit/side-nav-items instead of @atlaskit/navigation-system/side-nav-items.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			['use-side-nav-items-package']:
				'Side nav items have moved to @atlaskit/side-nav-items. Use the same subpath (e.g. @atlaskit/side-nav-items/button-menu-item instead of @atlaskit/navigation-system/side-nav-items/button-menu-item).',
			['use-side-nav-items-package-barrel']:
				'The following imports have moved to @atlaskit/side-nav-items: {{ names }}. Import them from @atlaskit/side-nav-items.',
		},
	},
	create(context) {
		return {
			ImportDeclaration(node: Rule.Node) {
				if (!isNodeOfType(node, 'ImportDeclaration')) {
					return;
				}
				const source = node.source;
				const value = typeof source.value === 'string' ? source.value : undefined;
				if (value === undefined) {
					return;
				}

				// Import is from an entrypoint starting with @atlaskit/navigation-system/side-nav-items/*
				if (value.startsWith(DEPRECATED_PREFIX)) {
					const replacement = REPLACEMENT_PREFIX + value.slice(DEPRECATED_PREFIX.length);
					context.report({
						node,
						messageId: 'use-side-nav-items-package',
						suggest: [
							{
								messageId: 'use-side-nav-items-package',
								fix(fixer) {
									return fixer.replaceText(source, `'${replacement}'`);
								},
							},
						],
					});
					return;
				}

				// Import is from the barrel entrypoint: @atlaskit/navigation-system
				if (value === BARREL_ENTRYPOINT && node.specifiers?.length) {
					const movedNames: string[] = [];
					const movedBySubpath = new Map<string, Array<{ imported: string; local: string }>>();
					for (const spec of node.specifiers) {
						if (spec.type === 'ImportSpecifier' && spec.imported.type === 'Identifier') {
							const importedName = spec.imported.name;
							const localName = spec.local.name;
							const subpath = EXPORT_TO_ENTRYPOINT_SUBPATH[importedName];
							if (subpath) {
								movedNames.push(importedName);
								const list = movedBySubpath.get(subpath) ?? [];
								list.push({ imported: importedName, local: localName });
								movedBySubpath.set(subpath, list);
							}
						}
					}

					if (movedNames.length > 0) {
						const { sourceCode } = context;
						context.report({
							node,
							messageId: 'use-side-nav-items-package-barrel',
							data: { names: movedNames.join(', ') },
							suggest: [
								{
									messageId: 'use-side-nav-items-package-barrel',
									fix(fixer) {
										const keepSpecifiers = node.specifiers.filter((spec) => {
											if (spec.type !== 'ImportSpecifier' || spec.imported.type !== 'Identifier') {
												return true;
											}
											return !(spec.imported.name in EXPORT_TO_ENTRYPOINT_SUBPATH);
										});

										const lines: string[] = [];
										if (keepSpecifiers.length > 0) {
											const defaultPart = keepSpecifiers.find(
												(s) => s.type === 'ImportDefaultSpecifier',
											);
											const namespacePart = keepSpecifiers.find(
												(s) => s.type === 'ImportNamespaceSpecifier',
											);
											const namedKeep = keepSpecifiers.filter((s) => s.type === 'ImportSpecifier');
											const keepParts: string[] = [];
											if (defaultPart) {
												keepParts.push(sourceCode.getText(defaultPart));
											}
											if (namespacePart) {
												keepParts.push(sourceCode.getText(namespacePart));
											}
											if (namedKeep.length) {
												keepParts.push(
													`{ ${namedKeep.map((s) => sourceCode.getText(s)).join(', ')} }`,
												);
											}
											lines.push(`import ${keepParts.join(', ')} from '${BARREL_ENTRYPOINT}';`);
										}

										for (const [subpath, specs] of movedBySubpath) {
											const specStr = specs
												.map((s) =>
													s.imported === s.local ? s.imported : `${s.imported} as ${s.local}`,
												)
												.join(', ');
											lines.push(`import { ${specStr} } from '${REPLACEMENT_PREFIX}/${subpath}';`);
										}

										return fixer.replaceText(node, lines.join('\n'));
									},
								},
							],
						});
					}
				}
			},
		};
	},
});

export default rule;
