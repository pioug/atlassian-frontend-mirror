import type { Rule } from 'eslint';
import type { Node as EsNode } from 'estree';

import { skipForExampleFiles, skipForTestFiles } from '../util/file-exclusions';

const NATIVE_STORAGE_NAMES = ['localStorage', 'sessionStorage'] as const;
type NativeStorageName = (typeof NATIVE_STORAGE_NAMES)[number];

const isNativeStorage = (name: string): name is NativeStorageName =>
	(NATIVE_STORAGE_NAMES as readonly string[]).includes(name);

const ALLOWED_PROVIDER_PACKAGE = '@atlassian/browser-storage-controls';
const ALLOWED_PROVIDER_CLASSES = ['AtlBrowserStorageLocal', 'AtlBrowserStorageSession'];

const getPropertyName = (property: EsNode | { name?: string }): string | null => {
	const prop = property as { type?: string; name?: string; value?: unknown };
	if (prop.type === 'Identifier' && typeof prop.name === 'string') {
		return prop.name;
	}
	if (prop.type === 'Literal' && typeof prop.value === 'string') {
		return prop.value;
	}
	return null;
};

const resolveNativeStorageName = (node: EsNode): NativeStorageName | null => {
	if (node.type === 'Identifier') {
		return isNativeStorage(node.name) ? node.name : null;
	}

	if (node.type === 'ChainExpression') {
		return resolveNativeStorageName(node.expression);
	}

	if (node.type === 'MemberExpression') {
		const propName = getPropertyName(node.property as EsNode);
		if (propName === null || !isNativeStorage(propName)) {
			return null;
		}

		const obj = node.object;
		if (obj.type === 'Identifier' && (obj.name === 'window' || obj.name === 'globalThis')) {
			return propName;
		}
		if (obj.type === 'ChainExpression') {
			const inner = obj.expression;
			if (
				inner.type === 'MemberExpression' &&
				getPropertyName(inner.property as EsNode) === 'window' &&
				inner.object.type === 'Identifier' &&
				inner.object.name === 'globalThis'
			) {
				return propName;
			}
			return null;
		}
		if (obj.type === 'MemberExpression') {
			const outerProp = getPropertyName(obj.property as EsNode);
			const outerObj = obj.object;
			if (
				outerProp === 'window' &&
				outerObj.type === 'Identifier' &&
				outerObj.name === 'globalThis'
			) {
				return propName;
			}
		}
	}

	return null;
};

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'Disallow direct usage of window.localStorage / window.sessionStorage. Use a vetted browser-storage provider (e.g. AtlBrowserStorageLocal / AtlBrowserStorageSession from @atlassian/browser-storage-controls) to stay compliant with Enterprise Grade capability CM-04.',
			recommended: false,
		},
		messages: {
			noDirectStorageUse:
				'Native browser {{name}} API usage is not allowed. Use a vetted browser-storage provider (e.g. AtlBrowserStorageLocal / AtlBrowserStorageSession from @atlassian/browser-storage-controls) to stay compliant with Enterprise Grade capability CM-04.',
		},
		schema: [],
	},

	create(context) {
		// Skip non-source files (test/example) early.
		const skipTest = skipForTestFiles(context);
		if (skipTest) {
			return skipTest;
		}
		const skipExample = skipForExampleFiles(context);
		if (skipExample) {
			return skipExample;
		}

		let isBrowserStorageControlsImported = false;
		const validIdentifiers = new Set<string>();
		const reportedNodes = new WeakSet<object>();

		const report = (node: Rule.Node, name: string): void => {
			if (reportedNodes.has(node)) {
				return;
			}
			reportedNodes.add(node);
			context.report({
				node,
				messageId: 'noDirectStorageUse',
				data: { name },
			});
		};

		const isMemberChainCalleeOfCallExpression = (start: Rule.Node): boolean => {
			let current: Rule.Node = start;
			// eslint-disable-next-line no-constant-condition
			while (true) {
				const parentNode = current.parent as Rule.Node | undefined;
				if (parentNode?.type === 'CallExpression' && parentNode.callee === current) {
					return true;
				}
				if (!parentNode) {
					return false;
				}
				if (parentNode.type === 'MemberExpression' && parentNode.object === current) {
					const grandparent = parentNode.parent as Rule.Node | undefined;
					if (grandparent?.type === 'CallExpression' && grandparent.callee === parentNode) {
						return true;
					}
					current = parentNode;
					continue;
				}
				if (
					parentNode.type === 'ChainExpression' &&
					(parentNode.parent as Rule.Node | undefined)?.type === 'MemberExpression' &&
					(parentNode.parent as Rule.Node as unknown as { object: unknown }).object === parentNode
				) {
					current = parentNode.parent as Rule.Node;
					continue;
				}
				return false;
			}
		};

		return {
			ImportDeclaration(node) {
				if (
					typeof node.source.value === 'string' &&
					(node.source.value === ALLOWED_PROVIDER_PACKAGE ||
						node.source.value.startsWith(`${ALLOWED_PROVIDER_PACKAGE}/`))
				) {
					isBrowserStorageControlsImported = true;
				}
			},

			VariableDeclarator(node) {
				// Track AtlBrowserStorage* class instantiations (rare; usually used as static).
				if (
					isBrowserStorageControlsImported &&
					node.init &&
					node.init.type === 'NewExpression' &&
					node.init.callee.type === 'Identifier' &&
					ALLOWED_PROVIDER_CLASSES.includes(node.init.callee.name) &&
					node.id.type === 'Identifier'
				) {
					validIdentifiers.add(node.id.name);
				}

				if (node.init && node.init.type === 'Identifier' && isNativeStorage(node.init.name)) {
					report(node.init as unknown as Rule.Node, node.init.name);
				}

				if (node.id.type === 'ObjectPattern' && node.init) {
					const initIsHostObject =
						(node.init.type === 'Identifier' &&
							(node.init.name === 'window' || node.init.name === 'globalThis')) ||
						(node.init.type === 'MemberExpression' &&
							(node.init.object as { name?: string }).name === 'globalThis' &&
							(node.init.property as { name?: string }).name === 'window');
					if (initIsHostObject) {
						for (const prop of node.id.properties) {
							if (
								prop.type === 'Property' &&
								prop.key.type === 'Identifier' &&
								isNativeStorage(prop.key.name)
							) {
								report(prop.value as unknown as Rule.Node, prop.key.name);
							}
						}
					}
				}
			},

			MemberExpression(node) {
				const parent = node.parent as Rule.Node | undefined;
				const isInDestructuring =
					parent?.type === 'Property' &&
					(parent.parent as Rule.Node | undefined)?.type === 'ObjectPattern';

				const willBeHandledByCallExpression = isMemberChainCalleeOfCallExpression(
					node as unknown as Rule.Node,
				);

				if (!isInDestructuring && !willBeHandledByCallExpression) {
					const resolved = resolveNativeStorageName(node as unknown as EsNode);
					if (resolved) {
						report(node as unknown as Rule.Node, resolved);
					}
				}

				if (
					!willBeHandledByCallExpression &&
					node.object.type === 'Identifier' &&
					isNativeStorage(node.object.name)
				) {
					report(node as unknown as Rule.Node, node.object.name);
				}
			},

			CallExpression(node) {
				if (node.callee.type !== 'MemberExpression') {
					return;
				}

				const calleeObject = node.callee.object;

				// Fast path: bare Identifier (`localStorage.getItem`, `sessionStorage.setItem`).
				if (calleeObject.type === 'Identifier') {
					const objectName = calleeObject.name;

					// Allow vetted provider classes' static calls.
					if (isBrowserStorageControlsImported && ALLOWED_PROVIDER_CLASSES.includes(objectName)) {
						return;
					}

					if (validIdentifiers.has(objectName)) {
						return;
					}

					if (!isNativeStorage(objectName)) {
						return;
					}

					report(node as unknown as Rule.Node, objectName);
					return;
				}

				const storageName = resolveNativeStorageName(calleeObject);
				if (storageName === null) {
					return;
				}

				report(node as unknown as Rule.Node, storageName);
			},

			Identifier(node) {
				if (validIdentifiers.has(node.name)) {
					return;
				}
				if (!isNativeStorage(node.name)) {
					return;
				}

				const parent = node.parent as Rule.Node | undefined;
				if (!parent) {
					return;
				}

				// Already handled by the visitors above.
				if (
					parent.type === 'VariableDeclarator' ||
					parent.type === 'MemberExpression' ||
					parent.type === 'ImportDeclaration'
				) {
					return;
				}

				// Skip when used as a property key (including destructuring keys).
				if (parent.type === 'Property' && (parent as { key?: unknown }).key === node) {
					return;
				}

				if (
					parent.type === 'CallExpression' ||
					parent.type === 'ReturnStatement' ||
					parent.type === 'Property' ||
					parent.type === 'ArrayExpression' ||
					(parent.type === 'ArrowFunctionExpression' &&
						(parent as { body?: unknown }).body === node) ||
					parent.type === 'ConditionalExpression'
				) {
					report(node as unknown as Rule.Node, node.name);
				}
			},
		};
	},
};

export default rule;
