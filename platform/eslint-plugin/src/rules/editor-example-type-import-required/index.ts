import fs from 'fs';
import path from 'path';
import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';
import type { Rule } from 'eslint';

export const RULE_NAME = 'editor-example-type-import-required';

/**
 * Spec files that are excluded from this rule because they don't use visitExample
 * or have their own test harness that doesn't follow the exampleName fixture pattern.
 *
 * Paths are matched as suffixes of the file path (platform-relative).
 */
const EXCLUDED_SPEC_FILES: string[] = [
	// Meta-tests for the testing infrastructure itself
	'build/test-tooling/integration-testing/src/examples/__tests__/playwright/example.spec.ts',
	'build/test-tooling/integration-testing/src/matchers/__tests__/playwright/to-have-height.spec.ts',
	'build/test-tooling/integration-testing/src/matchers/__tests__/playwright/to-have-width.spec.ts',
	// Tests the a11y decorator itself, no visitExample
	'packages/accessibility/axe-integration/a11y-playwright-testing/src/auto-a11y-setup/__tests__/playwright/skip-decorator.spec.ts',
	// Stub test (expect(true).toBe(true)), no visitExample
	'packages/ai-mate/rovo-content-bridge-api/__tests__/playwright/index.spec.tsx',
	// Page-object's visitExample call carries the typeof import(...) generic,
	// so the typed example reference lives in _helpers/page-object.ts rather
	// than in test.use({ exampleName }) in the spec itself.
	'packages/navigation/atlassian-switcher/src/__tests__/playwright/navigate-child-item.spec.ts',
	'packages/navigation/atlassian-switcher/src/__tests__/playwright/navigate-link-item.spec.ts',
	'packages/navigation/atlassian-switcher/src/__tests__/playwright/navigate-product-item.spec.ts',
	// Spec runs through a page-object (pages/generic-form-renderer.ts) whose
	// visitExample call already carries the typeof import(...) generic. The
	// typed reference therefore lives in the colocated page-object, not in
	// test.use({ exampleName }) in the spec.
	'packages/proforma/proforma-common-core/__tests__/playwright/json-test-cases.spec.ts',
	'packages/proforma/proforma-form-renderer/__tests__/playwright/json-test-cases.spec.ts',
	// Spec runs through a page-object that still uses raw page.goto() against
	// /examples.html. Migrating these requires reworking the page-object to
	// route through visitExample<typeof import(...)>(...).
	'packages/proforma/proforma-form-list/__tests__/playwright/form-list.spec.ts',
	'packages/proforma/proforma-form-renderer/__tests__/playwright/form-renderer.spec.ts',
	'packages/proforma/proforma-translations-editor/__tests__/playwright/translations-editor-with-form.spec.ts',
	// Tests the website itself, not examples
	'website/src/__tests__/playwright/examples.spec.ts',
	'website/src/__tests__/playwright/home.spec.ts',

	// react-ufo: uses an `examplePage: string` fixture where the name (e.g. 'basic') is
	// resolved to the example file internally by visitExample — the name does not match
	// the file name (e.g. '01-basic.tsx'), so a typeof import assertion is not possible
	// without refactoring the fixture to use keyof typeof import directly. Specs that
	// happen to also use the inline `visitExample<typeof import(...)>` pattern alongside
	// the fixture pass via the file-level typeof import check above and don't appear here.
	'packages/react-ufo/atlaskit/__tests__/playwright/apply-segments-threshold.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/bad-replacement-node.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/base-10-sections.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/base-100-sections.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/base-3-sections-ssr-timings.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/base-3-sections-unmount.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/css-display-contents.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/custom-cohort-data.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/custom-data.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/data-vc-ignore-if-no-layout-shift.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/full-pixel-horizontal.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/full-pixel.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/fy25_02.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/hold.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/interactions-responsiveness.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/interactions-unknown-element.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/interactions-vc.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/is-opened-in-background.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/is-tab-throttled.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/metric-variants.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/minor-interactions.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/non-visual-style.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/page-visibility-hidden-timestamp.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/payload-integrity.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/post-interaction-late-holds.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/post-interaction-log-always-send.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/replacement-node.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/revisions.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/same-attribute-value-mutation.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/speed-index.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/ssr-placeholder-v3.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/terminal-error.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/third-party-segment-extra-metrics.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/third-party-segment-iframe.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/third-party-segment-timings.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/third-party-segment.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/transition-vc.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/ttai.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/ufo-blindspot-watchdog.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/ufo-errors.spec.ts',
	'packages/react-ufo/atlaskit/__tests__/playwright/vc-dirty.spec.ts',

	// editor-performance-metrics: same pattern as react-ufo — uses an `examplePage: string` fixture
	// where the name resolves internally and does not match the example file name.
	'packages/editor/editor-performance-metrics/__tests__/playwright/basic-editor-ttai.spec.ts',
	'packages/editor/editor-performance-metrics/__tests__/playwright/basic-react-app.spec.ts',
	'packages/editor/editor-performance-metrics/__tests__/playwright/latency-track.spec.ts',
	'packages/editor/editor-performance-metrics/__tests__/playwright/ttai-timers.spec.ts',
	'packages/editor/editor-performance-metrics/__tests__/playwright/vc-next-attribute-change.spec.ts',
	'packages/editor/editor-performance-metrics/__tests__/playwright/vc-next-element-moving.spec.ts',
	'packages/editor/editor-performance-metrics/__tests__/playwright/vc-next-moving-node.spec.ts',
	'packages/editor/editor-performance-metrics/__tests__/playwright/vc-next-placeholder.spec.ts',
	'packages/editor/editor-performance-metrics/__tests__/playwright/vc-next-react-remounting.spec.ts',
	'packages/editor/editor-performance-metrics/__tests__/playwright/vc-next-track-user-events.spec.ts',
	'packages/editor/editor-performance-metrics/__tests__/playwright/vc-next.spec.ts',

	// generative-ai-modal: the example name is passed dynamically at examplePage.goto({ example: '...' })
	// time rather than via test.use(), so a static typeof import assertion in the spec is not possible.
	'packages/editor/generative-ai-modal/src/ui/screens/Preview/__tests__/playwright/tab-navigation.spec.ts',

];

function isExcluded(filename: string): boolean {
	const normalised = filename.replace(/\\/g, '/');
	return EXCLUDED_SPEC_FILES.some((excluded) => normalised.endsWith(excluded));
}

const messages = {
	missingExampleName:
		'Playwright spec files must include exampleName with a ' +
		'typeof import type assertion in test.use(). ' +
		"Add: exampleName: 'testing' as keyof typeof import('../../../examples/testing.tsx') ",
	missingTypeAssertion:
		'exampleName must include a typeof import type assertion for the static import graph. ' +
		"Use: exampleName: '{{ value }}' as keyof typeof import('{{ expectedPath }}') ",
	pathMismatch:
		'The import path "{{ importPath }}" does not resolve to the expected example file ' +
		"for exampleName '{{ exampleName }}'. Expected: {{ expectedPath }}",
} satisfies Record<string, string>;

function isTargetFile(filename: string): boolean {
	return (
		(filename.endsWith('.spec.tsx') || filename.endsWith('.spec.ts')) && !isExcluded(filename)
	);
}

/**
 * Resolves the example file path from the spec file's location and the example name.
 * Editor specs follow: packages/{groupId}/{packageId}/src/__tests__/playwright/*.spec.ts
 * Examples live at:    packages/{groupId}/{packageId}/examples/{exampleName}.tsx
 */
function resolveExamplePath(testFilePath: string, exampleName: string): string | null {
	const testFileDir = path.dirname(testFilePath);
	const segments = testFileDir.split(path.sep);
	const packagesIndex = segments.findIndex((seg) => seg === 'packages');
	if (packagesIndex === -1) {
		return null;
	}

	const groupId = segments[packagesIndex + 1];
	const packageId = segments[packagesIndex + 2];
	if (!groupId || !packageId) {
		return null;
	}

	const basePath = path.isAbsolute(testFilePath)
		? path.resolve('/', ...segments.slice(0, packagesIndex + 1))
		: path.resolve(process.cwd(), ...segments.slice(0, packagesIndex + 1));

	const examplesDir = path.resolve(basePath, groupId, packageId, 'examples');

	const candidateRe = new RegExp(`^(?:\\d+-)?${exampleName}(?:\\.examples?)?\\.tsx$`);
	try {
		const match = fs.readdirSync(examplesDir).find((f) => candidateRe.test(f));
		if (match) {
			return path.resolve(examplesDir, match);
		}
	} catch {
		// Directory doesn't exist (e.g. test environments)
	}

	return path.resolve(examplesDir, `${exampleName}.tsx`);
}

function computeRelativeImportPath(fromFile: string, toFile: string): string {
	const fromDir = path.dirname(fromFile);
	let relativePath = path.relative(fromDir, toFile);
	relativePath = relativePath.replace(/\\/g, '/');
	if (!relativePath.startsWith('.') && !relativePath.startsWith('/')) {
		relativePath = `./${relativePath}`;
	}
	return relativePath;
}

/**
 * Check if a property value has a `keyof typeof import(...)` type assertion.
 * Handles both:
 *   'name' as keyof typeof import('...')
 */
function extractTypeofImportPath(node: TSESTree.Expression): string | null {
	if (node.type !== AST_NODE_TYPES.TSAsExpression) {
		return null;
	}

	const typeAnnotation = node.typeAnnotation;

	if (
		typeAnnotation.type === AST_NODE_TYPES.TSTypeOperator &&
		typeAnnotation.operator === 'keyof'
	) {
		return extractFromTypeQuery(typeAnnotation.typeAnnotation);
	}

	if (typeAnnotation.type === AST_NODE_TYPES.TSUnionType) {
		for (const member of typeAnnotation.types) {
			if (member.type === AST_NODE_TYPES.TSTypeOperator && member.operator === 'keyof') {
				const result = extractFromTypeQuery(member.typeAnnotation);
				if (result) {
					return result;
				}
			}
		}
	}

	return null;
}

function extractFromTypeQuery(node: TSESTree.TypeNode | undefined): string | null {
	if (!node || node.type !== AST_NODE_TYPES.TSTypeQuery) {
		return null;
	}
	const { exprName } = node;
	if (exprName.type !== AST_NODE_TYPES.TSImportType) {
		return null;
	}
	const { argument } = exprName;
	if (
		argument.type === AST_NODE_TYPES.TSLiteralType &&
		argument.literal.type === AST_NODE_TYPES.Literal &&
		typeof argument.literal.value === 'string'
	) {
		return argument.literal.value;
	}
	return null;
}

/**
 * Extract the string value from a property value, ignoring type assertions.
 */
function getStringValue(node: TSESTree.Expression): string | null {
	if (node.type === AST_NODE_TYPES.Literal && typeof node.value === 'string') {
		return node.value;
	}
	if (node.type === AST_NODE_TYPES.TSAsExpression) {
		return getStringValue(node.expression as TSESTree.Expression);
	}
	return null;
}

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'Ensures that editor spec files using @af/editor-libra include exampleName with a ' +
				'typeof import type assertion in test.use() for the static import graph (factsMap).',
		},
		fixable: 'code',
		messages,
		schema: [],
	},
	create(context: Rule.RuleContext) {
		const filename = context.filename;
		if (!isTargetFile(filename)) {
			return {};
		}

		return {
			'Program:exit'(estreeNode) {
				const program = estreeNode as unknown as TSESTree.Program;

				// Single AST walk: collect all test.use() calls AND detect whether the
				// file contains any `typeof import('...')` reference at all (a TSImportType
				// node). Either signal is sufficient evidence that the spec ties at least
				// one example file into its TypeScript import graph.
				const testUseCalls: TSESTree.CallExpression[] = [];
				let hasAnyTypeofImport = false;
				const visited = new Set<TSESTree.Node>();
				const queue: TSESTree.Node[] = [program];
				while (queue.length > 0) {
					const node = queue.shift()!;
					if (visited.has(node)) {
						continue;
					}
					visited.add(node);
					if (
						node.type === AST_NODE_TYPES.CallExpression &&
						node.callee.type === AST_NODE_TYPES.MemberExpression &&
						node.callee.property.type === AST_NODE_TYPES.Identifier &&
						node.callee.property.name === 'use' &&
						node.arguments.length > 0 &&
						node.arguments[0].type === AST_NODE_TYPES.ObjectExpression
					) {
						testUseCalls.push(node);
					}
					if (node.type === AST_NODE_TYPES.TSImportType) {
						hasAnyTypeofImport = true;
					}
					for (const key of Object.keys(node)) {
						if (key === 'parent') {
							continue;
						}
						const child = (node as any)[key];
						if (Array.isArray(child)) {
							for (const item of child) {
								if (item && typeof item.type === 'string') {
									queue.push(item);
								}
							}
						} else if (child && typeof child.type === 'string') {
							queue.push(child);
						}
					}
				}

				// Any `typeof import('...')` anywhere in the spec — including the
				// `page.visitExample<typeof import('...')>(...)` and
				// `page.visitMockedExample<typeof import('...')>(...)` patterns used
				// outside of test.use() — satisfies the same goal as the canonical
				// `test.use({ exampleName: '...' as keyof typeof import('...') })`
				// pattern: the example file is referenced from the spec's TypeScript
				// import graph.
				if (hasAnyTypeofImport) {
					return;
				}

				// Check if any test.use() call anywhere in the file has exampleName with a typeof import assertion
				const fileHasExampleName = testUseCalls.some((call) => {
					const obj = call.arguments[0] as TSESTree.ObjectExpression;
					return obj.properties.some((prop) => {
						if (
							prop.type !== AST_NODE_TYPES.Property ||
							prop.key.type !== AST_NODE_TYPES.Identifier ||
							prop.key.name !== 'exampleName'
						) {
							return false;
						}
						return extractTypeofImportPath(prop.value as TSESTree.Expression) !== null;
					});
				});

				if (fileHasExampleName) {
					return;
				}

				// Find the first test.use() call that has exampleName without the typeof import assertion
				// (if any), otherwise use the first test.use() call
				let targetCall = testUseCalls[0];
				let existingExampleNameProp: TSESTree.Property | null = null;

				for (const call of testUseCalls) {
					const obj = call.arguments[0] as TSESTree.ObjectExpression;
					const prop = obj.properties.find(
						(p): p is TSESTree.Property =>
							p.type === AST_NODE_TYPES.Property &&
							p.key.type === AST_NODE_TYPES.Identifier &&
							p.key.name === 'exampleName',
					);
					if (prop) {
						targetCall = call;
						existingExampleNameProp = prop;
						break;
					}
				}

				if (!targetCall) {
					return;
				}

				const objectArg = targetCall.arguments[0] as TSESTree.ObjectExpression;

				// Determine the example name to use for the import path
				const exampleNameValue = existingExampleNameProp
					? getStringValue(existingExampleNameProp.value as TSESTree.Expression)
					: null;
				const defaultName = exampleNameValue ?? 'testing';
				const examplePath = resolveExamplePath(filename, defaultName);
				if (!examplePath) {
					return;
				}
				const importPath = computeRelativeImportPath(filename, examplePath);

				context.report({
					node: targetCall as unknown as Rule.Node,
					messageId: 'missingExampleName',
					fix(fixer) {
						// If exampleName exists but lacks typeof import, replace its value
						if (existingExampleNameProp) {
							return fixer.replaceText(
								existingExampleNameProp.value as any,
								`'${defaultName}' as keyof typeof import('${importPath}') `,
							);
						}
						// Otherwise insert exampleName as the first property
						const firstProp = objectArg.properties[0];
						if (!firstProp) {
							return fixer.replaceText(
								targetCall.arguments[0] as any,
								`{\n\texampleName: '${defaultName}' as keyof typeof import('${importPath}'),\n}`,
							);
						}
						const sourceCode = context.sourceCode;
						const token = sourceCode.getFirstToken(firstProp as any);
						const indent = token ? '\t'.repeat(token.loc.start.column) : '\t';
						return fixer.insertTextBefore(
							firstProp as any,
							`exampleName: '${defaultName}' as keyof typeof import('${importPath}') ,\n${indent}`,
						);
					},
				});
			},
		};
	},
};

export default rule;
