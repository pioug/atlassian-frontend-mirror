module.exports = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Warn that changes to next-schema or schema should be reflected in the other.',
		},
		schema: [],
	},
	create(context) {
		const { filename } = context;
		const nextSchemaFilesPattern = /.*\/adf-schema\/packages\/adf-schema\/src\/next-schema\/.*/u;
		const schemaFilesPattern = /.*\/adf-schema\/packages\/adf-schema\/src\/schema\/.*/u;

		const isInSchemaOrNextSchema =
			filename.match(nextSchemaFilesPattern) || filename.match(schemaFilesPattern);

		// eslint-disable-next-line consistent-return
		const findDefine = (node) => {
			const callExpression = node;
			const memberExpression = callExpression.callee;
			const { property } = memberExpression;
			if (property && property?.type === 'Identifier' && property?.name === 'define') {
				return callExpression;
			}
			if (memberExpression && memberExpression?.object?.type === 'CallExpression') {
				return findDefine(memberExpression.object);
			}
		};

		const reportInSchema = (objectExpression) => {
			if (!objectExpression) {
				return;
			}

			const parseDOMProp = objectExpression?.properties?.find(
				(p) => p?.key?.type === 'Identifier' && p?.key?.name === 'parseDOM',
			);

			const toDOMProp = objectExpression?.properties?.find(
				(p) => p?.key?.type === 'Identifier' && p?.key?.name === 'toDOM',
			);

			if (parseDOMProp) {
				context.report({
					node: parseDOMProp.key,
					message: 'Changes to next-schema or schema should be reflected in the other.',
				});
			}

			if (toDOMProp) {
				context.report({
					node: toDOMProp.key,
					message: 'Changes to next-schema or schema should be reflected in the other.',
				});
			}
		};

		const reportInNextSchema = (defineCallExpression) => {
			const defineArgs = defineCallExpression.arguments.find((p) => {
				return p.type === 'ObjectExpression';
			});
			const attrsProp = defineArgs?.properties?.find(
				(p) => p.key.type === 'Identifier' && p.key.name === 'attrs',
			);
			if (attrsProp) {
				context.report({
					node: attrsProp.key,
					message: 'Changes to next-schema or schema should be reflected in the other.',
				});
			}
		};

		return {
			// packages/adf-schema/src/schema/nodes/unknown-block.ts
			ExportDefaultDeclaration(node) {
				if (!isInSchemaOrNextSchema) {
					return;
				}
				if (node?.declaration?.expression?.type === 'ObjectExpression') {
					const objectExpression = node.declaration.expression;
					reportInSchema(objectExpression);
				}
			},
			ExpressionStatement(node) {
				if (!isInSchemaOrNextSchema) {
					return;
				}
				if (node.expression.type === 'CallExpression') {
					const defineCallExpression = findDefine(node.expression);

					if (defineCallExpression) {
						reportInNextSchema(defineCallExpression);
					}
				}
			},
			ReturnStatement(node) {
				if (!isInSchemaOrNextSchema) {
					return;
				}
				if (node?.argument && node?.argument?.type === 'CallExpression') {
					const callExpression = node.argument;
					const args = callExpression.arguments;
					const objectExpression = args.find((a) => a?.type === 'ObjectExpression');
					if (objectExpression) {
						reportInSchema(objectExpression);
					}
				}
			},
			VariableDeclarator(node) {
				if (!isInSchemaOrNextSchema) {
					return;
				}
				if (node.init && node.init.type === 'ObjectExpression') {
					const objExpression = node.init;
					reportInSchema(objExpression);
				}
				if (node.init && node.init.type === 'CallExpression') {
					const callExpression = node.init;

					const arg = callExpression.arguments.find((a) => {
						return a.type === 'ObjectExpression';
					});

					if (arg) {
						reportInSchema(arg);
					}

					const define = findDefine(callExpression);

					if (define) {
						reportInNextSchema(define);
					}
				}
			},
		};
	},
};
