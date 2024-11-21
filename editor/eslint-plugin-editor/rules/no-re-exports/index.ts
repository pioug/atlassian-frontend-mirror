import type { AST, Rule } from 'eslint';

type Location = AST.SourceLocation | null | undefined;

function createReportEntry({ name, loc }: { name: string; loc: Location }) {
	return {
		data: { name },
		loc: loc ?? { line: 0, column: 0 },
		messageId: 'noReExport',
	};
}

export const rule: Rule.RuleModule = {
	create(context) {
		const importsMap = new Map<string, Location>();
		const exportsMap = new Map<string, Location>();

		return {
			// export * from "./file";
			ExportAllDeclaration(node) {
				context.report(
					createReportEntry({
						name: '*',
						loc: node.loc,
					}),
				);
			},

			// export { default } from "@atlaskit/editor-plugin-block-type";
			// export { a, b } from "./exports_decl";
			// export { a as a2, b as b2 } from "./exports_decl";
			// export { c };
			// export { c as b };
			// export const a = {d: c};
			// export const a = c;
			ExportNamedDeclaration(node) {
				if (node.declaration?.type === 'VariableDeclaration') {
					for (const decl of node.declaration.declarations) {
						// export const a = c;
						if (decl.type === 'VariableDeclarator' && decl.init?.type === 'Identifier') {
							exportsMap.set(decl.init.name, decl.loc);
							continue;
						}

						// export const a = {d: c};
						if (decl.type === 'VariableDeclarator' && decl.init?.type === 'ObjectExpression') {
							for (const prop of decl.init.properties) {
								if (prop.type === 'Property' && prop.value.type === 'Identifier') {
									exportsMap.set(prop.value.name, prop.loc);
								}
							}
						}
					}

					return;
				}

				for (const specifier of node.specifiers) {
					if (specifier.local.type !== 'Identifier') {
						continue;
					}

					if (node.source) {
						context.report(
							createReportEntry({
								name: specifier.local.name,
								loc: specifier.local.loc,
							}),
						);
					} else {
						exportsMap.set(specifier.local.name, specifier.local.loc);
					}
				}
			},

			// export default a;
			ExportDefaultDeclaration(node) {
				if (node.declaration.type === 'Identifier') {
					exportsMap.set(node.declaration.name, node.declaration.loc);
				}
			},

			// import React from "react";
			ImportDefaultSpecifier(node) {
				importsMap.set(node.local.name, node.local.loc);
			},

			// import * as ReactStar from "react";
			// import type * as Hello2 from "./lib/c";
			ImportNamespaceSpecifier(node) {
				importsMap.set(node.local.name, node.local.loc);
			},

			// import { useState } from "react";
			// import { useState as useSomething } from "react";
			// import { A as Aa, type C } from "./lib/c";
			// import type { Aaa } from "./lib/c";
			// import { type Ab } from "./lib/c";
			ImportSpecifier(node) {
				importsMap.set(node.local.name, node.local.loc);
			},

			'Program:exit': () => {
				for (const exportName of exportsMap.keys()) {
					if (importsMap.has(exportName)) {
						context.report(
							createReportEntry({
								name: exportName,
								loc: exportsMap.get(exportName),
							}),
						);
					}
				}
			},
		};
	},
	meta: {
		docs: {
			description: 'Disallows re-exports of imports.',
		},
		messages: {
			noReExport: "Do not re-export '{{name}}'",
		},
		schema: [],
		type: 'layout',
	},
};
