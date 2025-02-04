/* eslint-disable no-console */
import fs from 'fs/promises';
import path from 'path';

import chalk from 'chalk';
import type {
	ASTPath,
	CallExpression,
	Collection,
	Expression,
	FileInfo,
	Identifier,
	ImportDeclaration,
	JSCodeshift,
	MemberExpression,
	StringLiteral,
	TemplateLiteral,
} from 'jscodeshift';

import {
	FallbackResolveResult,
	RemoveTokenFallbackOptions,
	TeamInfo,
	TransformationDetails,
} from '../types';

import { normalizeValues } from './normalize-values';
import { addOrUpdateEslintIgnoreComment } from './update-comments';

export class TokenProcessor {
	private j: JSCodeshift;
	private options: RemoveTokenFallbackOptions;
	private fileInfo: FileInfo;
	private source: Collection<any>;
	private rootDir: string;
	private details: TransformationDetails;
	private logMessages: string[] = [];
	private possibleExtensions = ['.ts', '.tsx', '.js', '.jsx'];
	private tokenMap: Record<string, string>;
	private teamInfo: TeamInfo;

	constructor(
		j: JSCodeshift,
		options: RemoveTokenFallbackOptions,
		fileInfo: FileInfo,
		source: Collection<any>,
		rootDir: string,
		details: TransformationDetails,
		tokenMap: Record<string, string>,
		teamInfo: TeamInfo,
	) {
		this.j = j;
		this.options = options;
		this.fileInfo = fileInfo;
		this.source = source;
		this.rootDir = rootDir;
		this.details = details;
		this.tokenMap = tokenMap;
		this.teamInfo = teamInfo;
	}

	async processAndLogSingleToken(
		callPath: ASTPath<CallExpression>,
	): Promise<{
		fallbackRemoved: boolean;
		resolvedImportDeclaration: ASTPath<ImportDeclaration> | undefined;
	}> {
		const line = callPath.node.loc?.start.line;
		const { shouldLog, ...rest } = await this.processSingleToken(callPath);
		if (this.options.silent || !shouldLog) {
			return rest;
		}
		const coloredPath = chalk.blue(this.fileInfo.path);
		const coloredLine = line ? `: ${chalk.green(line)}` : '';
		console.log(`${coloredPath}${coloredLine}: ${this.logMessages.join(' | ')}
----------------------------------------`);
		return rest;
	}

	private logVerbose(message: string): void {
		if (this.options.verbose) {
			this.log(message);
		}
	}

	private log(message: string): void {
		this.logMessages.push(message);
	}

	private logError(message: string): void {
		this.log(chalk.red(message));
	}

	private async processSingleToken(
		callPath: ASTPath<CallExpression>,
	): Promise<{
		shouldLog: boolean;
		fallbackRemoved: boolean;
		resolvedImportDeclaration: ASTPath<ImportDeclaration> | undefined;
	}> {
		const args = callPath.node.arguments;
		const line = callPath.node.loc?.start.line;
		if (args.length < 2) {
			this.logVerbose(chalk.yellow('Skipped token call without fallback'));
			return { shouldLog: false, fallbackRemoved: false, resolvedImportDeclaration: undefined };
		}
		const tokenKey = this.getTokenKey(args[0] as StringLiteral);
		if (!tokenKey) {
			return { shouldLog: true, fallbackRemoved: false, resolvedImportDeclaration: undefined };
		}
		const isSkipped =
			tokenKey.startsWith('elevation.shadow') ||
			tokenKey.startsWith('font.body') ||
			tokenKey.startsWith('font.heading');
		const tokenValue = isSkipped ? '' : this.tokenMap[tokenKey];
		this.logVerbose(
			`Token value from tokenMap: ${chalk.magenta(tokenValue)} for key: ${chalk.yellow(tokenKey)}`,
		);
		const { rawFallbackValue, fallbackValue, resolvedImportDeclaration } = isSkipped
			? { rawFallbackValue: 'N/A', fallbackValue: undefined, resolvedImportDeclaration: undefined }
			: await this.getFallbackValue(args[1]);
		const {
			difference,
			isAcceptableDifference,
			tokenLogValue,
			fallbackLogValue,
			normalizedTokenValue,
			normalizedFallbackValue,
		} = normalizeValues(tokenKey, tokenValue, fallbackValue);
		const areEqual = normalizedTokenValue === normalizedFallbackValue;
		const logData = {
			teamInfo: this.teamInfo,
			filePath: this.fileInfo.path,
			lineNumber: line || -1,
			tokenKey,
			rawFallbackValue,
			resolvedTokenValue: tokenValue,
			resolvedFallbackValue: fallbackValue ?? '',
			difference,
		};
		let fallbackRemoved = false;
		let importDeclaration: ASTPath<ImportDeclaration> | undefined;
		if (areEqual || isAcceptableDifference || this.options.forceUpdate) {
			this.log(
				chalk.green(
					areEqual
						? 'Token value and fallback value are equal, removing fallback'
						: 'Token value and fallback value are within acceptable difference threshold, removing fallback',
				),
			);
			args.pop();
			this.details.replaced.push(logData);
			fallbackRemoved = true;
			importDeclaration = resolvedImportDeclaration;
		} else {
			const message =
				normalizedFallbackValue === undefined
					? `Fallback value could not be resolved`
					: `Values mismatched significantly`;
			this.logError(message);
			if (this.options.addEslintComments) {
				addOrUpdateEslintIgnoreComment(this.j, tokenValue, fallbackValue, callPath);
			}
			this.details.notReplaced.push(logData);
		}
		this.log(
			`Token: ${chalk.yellow(tokenKey)}, Raw fallback: ${chalk.yellow(rawFallbackValue)}, Resolved token value: ${tokenLogValue}, Resolved fallback value: ${fallbackLogValue}`,
		);
		return { shouldLog: true, fallbackRemoved, resolvedImportDeclaration: importDeclaration };
	}

	private getTokenKey(arg: Expression): string | undefined {
		if (arg.type === 'StringLiteral') {
			const tokenKey = (arg as StringLiteral).value;
			this.logVerbose(`Determined token key as literal: ${chalk.yellow(tokenKey)}`);
			return tokenKey;
		} else {
			this.logError(`The first argument of token function is not a string literal`);
			return undefined;
		}
	}

	private async getFallbackValue(fallbackValueNode: Expression): Promise<FallbackResolveResult> {
		switch (fallbackValueNode.type) {
			case 'StringLiteral':
				return this.processFallbackAsStringLiteral(fallbackValueNode as StringLiteral);
			case 'Identifier':
				return this.processFallbackAsIdentifier(fallbackValueNode as Identifier);
			case 'MemberExpression':
				return this.processFallbackAsMemberExpression(fallbackValueNode as MemberExpression);
			case 'TemplateLiteral':
				return this.processFallbackAsTemplateLiteral(fallbackValueNode as TemplateLiteral);
			default:
				return { fallbackValue: undefined, rawFallbackValue: '' };
		}
	}

	private processFallbackAsStringLiteral(fallbackValueNode: StringLiteral): FallbackResolveResult {
		const fallbackValue = fallbackValueNode.value;
		this.logVerbose(`Fallback value is a literal: ${chalk.yellow(fallbackValue)}`);
		return { fallbackValue, rawFallbackValue: fallbackValue };
	}

	private async processFallbackAsIdentifier(
		fallbackValueNode: Identifier,
	): Promise<FallbackResolveResult> {
		const variableName = fallbackValueNode.name;
		const variableNameForLog = `${chalk.yellow(variableName)}`;
		let fallbackValue: string | undefined;

		this.logVerbose(
			`Fallback is an identifier: ${chalk.yellow(variableName)}, attempting to resolve...`,
		);

		// Check for local variable declaration
		const localVarDeclaration = this.source
			.find(this.j.VariableDeclarator, {
				id: { name: variableName },
			})
			.at(0);

		let resolvedImportDeclaration: ASTPath<ImportDeclaration> | undefined;

		if (localVarDeclaration.size()) {
			const init = localVarDeclaration.get().value.init;
			if (init.type === 'Literal' || init.type === 'StringLiteral') {
				fallbackValue = init.value;
				this.logVerbose(
					`Resolved fallback value from local variable: ${chalk.yellow(fallbackValue)} for identifier: ${variableNameForLog}`,
				);
			}
		} else {
			// Check for named import
			const importDeclaration = this.source
				.find(this.j.ImportDeclaration)
				.filter(this.createImportFilter(variableName))
				.at(0);
			if (importDeclaration.size()) {
				const importSource = importDeclaration.get().value.source.value;
				fallbackValue = await this.resolveValueFromImport(
					this.rootDir,
					importSource,
					undefined,
					variableName,
				);
				if (fallbackValue !== undefined) {
					this.logVerbose(
						`Resolved fallback value from import: ${chalk.yellow(fallbackValue)} for identifier: ${variableNameForLog}`,
					);
					resolvedImportDeclaration = importDeclaration.paths()[0];
				}
			} else {
				this.logVerbose(
					chalk.red(
						`Could not resolve fallback value for identifier: ${variableNameForLog}: it's neither a local variable nor an import`,
					),
				);
			}
		}
		return { rawFallbackValue: variableName, fallbackValue, resolvedImportDeclaration };
	}

	private async processFallbackAsMemberExpression(
		fallbackValueNode: MemberExpression,
	): Promise<FallbackResolveResult> {
		let objectName: string | undefined;
		let propertyName: string | undefined;
		let fallbackValue: string | undefined;
		if (fallbackValueNode.object.type === 'Identifier') {
			objectName = (fallbackValueNode.object as Identifier).name;
		}
		if (fallbackValueNode.property.type === 'Identifier') {
			propertyName = (fallbackValueNode.property as Identifier).name;
		} else if (
			fallbackValueNode.property.type === 'Literal' &&
			typeof fallbackValueNode.property.value === 'string'
		) {
			propertyName = fallbackValueNode.property.value;
		}
		if (!objectName || !propertyName) {
			this.logError(
				`Could not determine object and property names from member expression: ${chalk.yellow(fallbackValueNode)}`,
			);
			return { rawFallbackValue: '', fallbackValue };
		}
		const rawFallbackValue = `${objectName}.${propertyName}`;

		this.logVerbose(
			`Fallback is a member expression: ${chalk.yellow(rawFallbackValue)}, attempting to resolve...`,
		);
		let resolvedImportDeclaration: ASTPath<ImportDeclaration> | undefined;

		// Find the import statement for the object
		const importDeclaration = this.source
			.find(this.j.ImportDeclaration)
			.filter(this.createImportFilter(objectName))
			.at(0);
		if (importDeclaration.size()) {
			const importSource = importDeclaration.get().value.source.value;
			fallbackValue = await this.resolveValueFromImport(
				this.rootDir,
				importSource,
				objectName,
				propertyName,
			);
			if (fallbackValue !== undefined) {
				resolvedImportDeclaration = importDeclaration.paths()[0];
				this.logVerbose(
					`Resolved fallback value from member expression: ${chalk.yellow(fallbackValue)}`,
				);
			}
		} else {
			this.logError(
				`Could not find import for member expression: ${chalk.yellow(rawFallbackValue)}`,
			);
		}
		return { rawFallbackValue, fallbackValue, resolvedImportDeclaration };
	}

	private async processFallbackAsTemplateLiteral(
		fallbackValueNode: TemplateLiteral,
	): Promise<FallbackResolveResult> {
		const expressions = fallbackValueNode.expressions;
		let rawFallbackValue: string = '';
		let fallbackValue: string | undefined;
		const quasis = fallbackValueNode.quasis;
		if (expressions.length !== 1 || quasis.length !== 2) {
			this.logError(`Unsupported template literal structure`);

			return { rawFallbackValue, fallbackValue };
		}
		let exprValue: string | undefined;
		const expression = expressions[0];
		let resolvedImportDeclaration: ASTPath<ImportDeclaration> | undefined;
		if (expression.type === 'Identifier') {
			const result = await this.processFallbackAsIdentifier(expression);
			exprValue = result.fallbackValue;
			resolvedImportDeclaration = result.resolvedImportDeclaration;
		} else if (expression.type === 'MemberExpression') {
			const result = await this.processFallbackAsMemberExpression(expression);
			exprValue = result.fallbackValue;
			resolvedImportDeclaration = result.resolvedImportDeclaration;
		}
		if (exprValue !== undefined) {
			rawFallbackValue = `${quasis[0].value.raw}\${${exprValue}}${quasis[1].value.raw}`;
			fallbackValue = `${quasis[0].value.cooked}${exprValue}${quasis[1].value.cooked}`;

			this.logVerbose(
				`Resolved fallback value from template literal: ${chalk.yellow(fallbackValue)}`,
			);
		}
		return { rawFallbackValue, fallbackValue, resolvedImportDeclaration };
	}

	private tryResolveModulePath(moduleName: string): string | null {
		try {
			const resolvedPath = require.resolve(moduleName, { paths: [this.rootDir] });
			this.logVerbose(
				`Resolved module path: ${chalk.green(resolvedPath)} for ${chalk.cyan(moduleName)}`,
			);

			return resolvedPath;
		} catch (error) {
			return null;
		}
	}

	private async tryResolveLocalPath(
		currentDir: string,
		importPath: string,
	): Promise<string | null> {
		for (const ext of this.possibleExtensions) {
			const potentialPath = path.resolve(currentDir, `${importPath}${ext}`);
			try {
				await fs.access(potentialPath);
				this.logVerbose(`Resolved file path locally: ${chalk.green(potentialPath)}`);

				return potentialPath;
			} catch {
				// Continue if the file is not found
			}
		}
		return null;
	}

	private async resolveValueFromImport(
		currentDir: string,
		importPath: string,
		objectName: string | undefined,
		propertyOrVariableName: string,
	): Promise<string | undefined> {
		let filePath: string | null = this.tryResolveModulePath(importPath);
		if (!filePath) {
			filePath = await this.tryResolveLocalPath(currentDir, importPath);
		}
		if (!filePath) {
			this.logError(
				`File not found for import path: ${chalk.cyan(importPath)} in directory: ${chalk.blue(this.rootDir)}`,
			);
			return undefined;
		}

		this.logVerbose(`Reading file: ${chalk.green(filePath)}`);

		const fileContent = await fs.readFile(filePath, 'utf-8');
		const source = this.j(fileContent);
		if (objectName) {
			// Check if the object is imported from another module
			const imports = source.find(this.j.ImportDeclaration);
			const matchingImport = imports.filter(this.createImportFilter(objectName)).at(0);
			if (matchingImport.size()) {
				const importDecl = matchingImport.get().node;
				const newImportPath = importDecl.source.value?.toString();
				return this.resolveValueFromImport(
					path.dirname(filePath),
					newImportPath,
					objectName,
					propertyOrVariableName,
				);
			}
		}
		// If not imported, check for variable declaration
		const varDeclaration = source
			.find(this.j.VariableDeclarator, {
				id: { name: propertyOrVariableName },
			})
			.at(0);
		if (!varDeclaration.size()) {
			this.logError(
				`Variable declaration not found for ${chalk.yellow(propertyOrVariableName)} in file: ${chalk.green(filePath)}`,
			);
			return undefined;
		}
		const init = varDeclaration.get().value.init;
		if (
			init.type === 'Literal' ||
			init.type === 'StringLiteral' ||
			init.type === 'NumericLiteral'
		) {
			return init.value;
		} else {
			this.logError(
				`Unhandled init type ${init.type} for variable: ${chalk.yellow(propertyOrVariableName)} in file: ${chalk.green(filePath)}`,
			);
			return undefined;
		}
	}

	private createImportFilter(targetName: string): (path: ASTPath<ImportDeclaration>) => boolean {
		return (path: ASTPath<ImportDeclaration>) => {
			return (
				path.node.specifiers?.some((specifier) => {
					switch (specifier.type) {
						case 'ImportNamespaceSpecifier':
							return specifier.local?.name === targetName;
						case 'ImportDefaultSpecifier':
							return specifier.local?.name === targetName;
						case 'ImportSpecifier':
							return specifier.local?.name === targetName || specifier.imported.name === targetName;
						default:
							return false;
					}
				}) === true
			);
		};
	}
}
