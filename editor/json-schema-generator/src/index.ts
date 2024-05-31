/* eslint-disable no-bitwise */
import {
	type Node,
	type Type,
	type Symbol,
	JsxEmit,
	SymbolFlags,
	ObjectFlags,
	createProgram,
	type StringLiteralType,
} from 'typescript';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import JSON5 from 'json5';
import { resolve, join } from 'path';
import * as prettier from 'prettier';
import mkdirp from 'mkdirp';

import JSONSchemaNode, {
	type SchemaNode,
	StringSchemaNode,
	ArraySchemaNode,
	ObjectSchemaNode,
	EnumSchemaNode,
	PrimitiveSchemaNode,
	RefSchemaNode,
	EmptySchemaNode,
	AnyOfSchemaNode,
	AllOfSchemaNode,
} from './json-schema-nodes';

import {
	extractLiteralValue,
	getTags,
	getTypeFromSymbol,
	isAnyType,
	isArrayLikeType,
	isBooleanType,
	isInterfaceDeclaration,
	isIntersectionType,
	isNonPrimitiveType,
	isNumberType,
	isObjectType,
	isSourceFile,
	isStringType,
	isTypeAliasDeclaration,
	isUnionType,
	isTupleType,
	getPmName,
	isDefined,
} from './utils';

export default (
	files: string[],
	flags: any,
	root = 'doc_node',
	description = 'Schema for Atlassian Document Format.',
): Promise<void> => {
	// We check whether we're in the monorepo or not, and get paths if we are
	const project = join(__dirname, '../tsconfig.json');
	const dev = existsSync(project);
	let entryPointsTsConfig;
	if (dev) {
		entryPointsTsConfig = JSON5.parse(
			readFileSync(join(__dirname, '../../../../tsconfig.entry-points.json'), 'utf8'),
		);
	}
	const program = createProgram(files, {
		jsx: JsxEmit.React,
		// We need our paths configuration here to compile atlaskit dependencies now that we no longer
		// have root index.ts files
		baseUrl: join(__dirname, '..'),
		paths: entryPointsTsConfig?.compilerOptions.paths,
	});
	const checker = program.getTypeChecker();
	const typeIdToDefName: Map<number, string> = new Map();
	const experimentalNodes: Set<number> = new Set();
	const isSpecMode = flags.mode.toLowerCase() === 'spec' ? () => true : () => false;

	const jsonSchema = new JSONSchemaNode('draft-04', description, root);

	let ticks = 0;
	program.getSourceFiles().forEach(walk);

	return waitForTicks()
		.then(() => mkdirp(flags.outDir, () => {}))
		.then(() => {
			const { outDir, stage } = flags;
			const resolvedOutDir = resolve(outDir);
			if (!isSpecMode()) {
				jsonSchema.markAsUsed(root);
				const outputFileName = stage != null ? `stage-${stage}.json` : 'full.json';
				writeFileSync(
					join(resolvedOutDir, outputFileName),
					JSON.stringify(jsonSchema, null, 2) + '\n',
				);
			} else {
				return prettier.resolveConfig(process.cwd()).then(async (resolvedConfig) => {
					const options = {
						parser: 'babel',
						...resolvedConfig,
					} as prettier.Options;

					const exports = ['// DO NOT MODIFY THIS FILE, USE `yarn generate:spec`'];

					let awaitAllDefinitions: Promise<null>[] = [];

					jsonSchema.definitions.forEach(async (def, name) => {
						const promise = new Promise<null>(async (resolve) => {
							const fileName = getPmName(name);
							exports.push(`export { default as ${fileName} } from './${fileName}';`);
							writeFileSync(
								join(resolvedOutDir, `${fileName}.ts`),
								await prettier.format(
									`export default ${JSON.stringify(def.node.toSpec())}`,
									options!,
								),
							);
							resolve(null);
						});
						awaitAllDefinitions.push(promise);
					});

					await Promise.all(awaitAllDefinitions);
					// Generate index.ts with exports
					writeFileSync(
						join(resolvedOutDir, 'index.ts'),
						await prettier.format(exports.join('\n'), options!),
					);
				});
			}
		});

	function waitForTicks() {
		return new Promise<void>((resolve) => {
			const waitForTick = () => {
				process.nextTick(() => {
					ticks--;
					ticks > 0 ? waitForTick() : resolve();
				});
			};
			waitForTick();
		});
	}

	function walk(node: Node) {
		if (isSourceFile(node)) {
			node.forEachChild(walk);
		} else if (isInterfaceDeclaration(node) || isTypeAliasDeclaration(node)) {
			const symbol: Symbol = (node as any).symbol;
			const { name, ...rest } = getTags(symbol.getJsDocTags());
			if (name) {
				if (jsonSchema.hasDefinition(name)) {
					throw new Error(`Duplicate definition for ${name}`);
				}
				const type = checker.getTypeAtLocation(node);

				const defNode = getSchemaNodeFromType(type, rest);
				if (defNode) {
					jsonSchema.addDefinition(name, defNode);
					typeIdToDefName.set((type as any).id, name);
				}
			}
		} else {
			// If in future we need support for other nodes, this will help to debug
			// console.log(syntaxKindToName(node.kind));
			// node.forEachChild(walk);
		}
	}

	function shouldExclude(stage?: number) {
		return (
			(flags.stage === undefined && stage !== undefined) ||
			(flags.stage !== undefined && stage !== undefined && stage.toString() !== flags.stage)
		);
	}

	function getSchemaNodeFromType(type: Type, validators: any = {}): SchemaNode | undefined {
		const typeId = (type as any).id;
		if (shouldExclude(validators['stage'])) {
			experimentalNodes.add(typeId);
			return;
		} else if (experimentalNodes.has(typeId)) {
			return;
		}

		const nodeName = typeIdToDefName.get(typeId)!;
		if (typeIdToDefName.has(typeId)) {
			// Found a $ref
			jsonSchema.markAsUsed(nodeName);
			return new RefSchemaNode(nodeName);
		} else if (isStringType(type)) {
			return new StringSchemaNode(validators);
		} else if (isBooleanType(type)) {
			return new PrimitiveSchemaNode('boolean');
		} else if (isNumberType(type)) {
			return new PrimitiveSchemaNode('number', validators);
		} else if (isUnionType(type)) {
			const isEnum = type.types.every((t) => t.isStringLiteral());
			if (isEnum) {
				return new EnumSchemaNode(
					type.types
						.filter((t) => {
							const symbol = t.symbol || t.aliasSymbol;
							const validators = getTags(symbol?.getJsDocTags() || []);
							return !shouldExclude(validators['stage']);
						})
						.map((t) => (t as StringLiteralType).value),
				);
			} else {
				const options = type.types
					.map((t) => {
						return getSchemaNodeFromType(t, getTags((t.symbol || t.aliasSymbol).getJsDocTags()));
					})
					.filter(isDefined);
				/**
				 * We are lifting the type here to avoid unnecessary breaking change in schema validation.
				 * But, in terms of real data validation this changes nothing, since: AnyOf(Something) === Something
				 */
				return options.length === 1 ? options[0] : new AnyOfSchemaNode(options);
			}
		} else if (isIntersectionType(type)) {
			return new AllOfSchemaNode(
				type.types
					.map((t) => getSchemaNodeFromType(t, getTags(t.getSymbol()!.getJsDocTags())))
					.filter(isDefined),
			);
		} else if (isArrayLikeType(type)) {
			const node = new ArraySchemaNode([], validators);

			if (isTupleType(type.target)) {
				node._isTupleLike = true;
			}

			// [X, X | Y]
			if (!type.typeArguments || type.typeArguments.length === 0) {
				const types = type.getNumberIndexType();
				if (types) {
					// Indexed type means, it's Tuple like
					node._isTupleLike = true;

					// Look for all indexed type
					let i = 0;
					let prop: Symbol;
					while ((prop = type.getProperty(`${i}`)!)) {
						const validators = getTags(prop.getJsDocTags());
						node.push(getSchemaNodeFromType(getTypeFromSymbol(checker, prop), validators));
						i++;
					}

					/**
					 * This will usually be a Union type because it's not useful to write something like
					 * `interface X extends Array<X> { 0: X; }` which is equivalent of `Array<X>`.
					 * We usually do this to achieve something like
					 * `interface X extends Array<X | Y> { 0: X; }`
					 */
					if (isUnionType(types)) {
						node.push(getSchemaNodeFromType(types));
					}
				}
			} else {
				const types = type.typeArguments;
				node.push(
					types.length === 1 && isAnyType(types[0]) // Array<any>
						? []
						: types.map((t) => getSchemaNodeFromType(t)).filter(isDefined),
				);
			}
			return node;
		} else if (isObjectType(type)) {
			// Widen the type when we have Reference Type
			// Omit<ExtensionAttributes, 'layout'>
			let newType = type;
			if (type.objectFlags & ObjectFlags.Mapped && type.objectFlags & ObjectFlags.Instantiated) {
				const widenedType = checker.getWidenedType(type);
				if (isObjectType(widenedType)) {
					newType = widenedType;
				}
			}

			const obj = new ObjectSchemaNode({}, { additionalProperties: false, ...validators });
			// Use node's queue to prevent circular dependency
			process.nextTick(() => {
				ticks++;
				const props = checker.getPropertiesOfType(newType);
				props.forEach((prop) => {
					const { name } = prop;
					// Drop private properties __fileName, __fileType, etc
					if (name[0] !== '_' || name[1] !== '_') {
						// ts.SymbolFlags.Transient check can isolate props with type but not all Transient types are widened.
						const propType = prop.valueDeclaration
							? getTypeFromSymbol(checker, prop)
							: (prop as any).nameType;
						if (propType) {
							const isRequired = (prop.flags & SymbolFlags.Optional) === 0;
							const validators = getTags(prop.getJsDocTags());
							if (!isSpecMode() && validators.validatorFn) {
								// validatorFn is a spec-only annotation and should not be included in ADF
								// see https://product-fabric.atlassian.net/wiki/spaces/ADF/pages/2973303550/ADF+Change+58+bring+back+url+and+link+validation
								delete validators.validatorFn;
							}
							if (!shouldExclude(validators['stage'])) {
								// Remove it from validators otherwise it will end up as a property in ADF
								delete validators['stage'];
								const node = getSchemaNodeFromType(propType, validators);
								if (node) {
									obj.addProperty(name, node, isRequired);
								}
							}
						}
					}
				});
			});
			return obj;
		} else if (type.isLiteral()) {
			// Using ConstSchemaNode doesn't pass validation
			return new EnumSchemaNode(extractLiteralValue(type));
		} else if (isNonPrimitiveType(type)) {
			// object
			return new EmptySchemaNode();
		}

		throw new Error(`TODO: ${checker.typeToString(type)} to be defined`);
	}
};
