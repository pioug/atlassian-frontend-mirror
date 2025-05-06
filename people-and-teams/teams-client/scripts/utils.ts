import {
	type JSDoc,
	type JSDocTag,
	type JSDocTagInfo,
	type MethodDeclaration,
	Project,
	type ts,
	type Type,
} from 'ts-morph';

type ParsedParam = {
	name: string;
	type: string;
	required: boolean;
	docs: string;
};
type ParsedMethod = {
	name: string;
	params: ParsedParam[];
	returnType: string;
	docs: string;
	tags: string;
};

// Define a type for the parsed information
type ParsedInfo = {
	name: string;
	docs: string;
	methods: ParsedMethod[];
}[];

// Initialize a Project
const project = new Project();

const SINGLE_INDENT = '  ';

export function getMethodParameters(method: MethodDeclaration): ParsedParam[] {
	return method.getParameters().map((param) => {
		return {
			name: param.getName(),
			type: typeToText(param.getType()),
			required: !param.isOptional(),
			docs: param
				.getDecorators()
				.map((d) => d.getText())
				.join('\n'),
		};
	});
}

export function docsToString(docs: JSDoc[]): string {
	return docs.length > 0
		? docs
				.map((d) => d.getDescription())
				.join('\n')
				.trim()
		: '';
}

export function docsToTagsString(docs: JSDoc[]): string {
	return docs
		.flatMap((doc) => doc.getTags())
		.filter((t) => !['private'].includes(t.getTagName()))
		.map(tagToString)
		.join('\n')
		.trim();
}

export function parseMethod(method: MethodDeclaration): ParsedMethod {
	const params = getMethodParameters(method);

	const docs = method.getJsDocs();
	const docText = docsToString(docs);
	const tags = docsToTagsString(docs);

	return {
		name: method.getName(),
		params,
		returnType: typeToText(method.getReturnType()),
		docs: docText,
		tags: tags,
	};
}

export function parseFile(path: string) {
	// Add the TypeScript file we want to parse
	const file = project.addSourceFileAtPath(path);

	// Get all the classes in the file
	const classes = file.getClasses();

	const parsedInfo: ParsedInfo = classes.map((cls) => {
		const methods = cls.getMethods().map(parseMethod);

		return {
			name: cls.getName() || '',
			docs: cls.getJsDocs()[0]?.getDescription() || '',
			methods,
		};
	});
	return parsedInfo;
}

export function tagToString(tag: JSDocTag<ts.JSDocTag>) {
	const tagName = tag.getTagName().toLowerCase();
	const tagText = tag.getText(true).replace(/\*/g, '');
	if (tagName === 'deprecated') {
		return `* ***${tagName.toLocaleUpperCase()}*** - ${tagText}`;
	}
	return tagText.trim().length > 0 ? `* ${tagText}` : '';
}

export function stripImportPath(typeText: string): string {
	return typeText.replace(/import\("[^"]+"\)\./g, '');
}

export function indent(level: number): string {
	return SINGLE_INDENT.repeat(level);
}

function jsdocTagToString(tag: JSDocTagInfo): string {
	try {
		const name = tag.getName();
		if (['private'].includes(name)) {
			return '';
		}
		const comment = JSON.parse(JSON.stringify(tag.getText()) as any)[0].text.trim();
		if (comment === '') {
			return `${name}`;
		}
		if (name === '') {
			return `${comment}`;
		}
		return `*${name}*: ${comment}`;
	} catch {
		return '';
	}
}

export function getPropDocs(tags: JSDocTagInfo[]): string {
	return tags.map(jsdocTagToString).join('').trim();
}

export function typeToText(t: Type<ts.Type>, level: number = 1): string {
	try {
		if (t.isLiteral()) {
			return `\\\`'${t.getLiteralValueOrThrow()}'\\\``;
		}
		if (t.isUnion()) {
			return t
				.getUnionTypes()
				.map((t) => typeToText(t, level + 1))
				.join(' | ');
		}
		// if (t.isEnum()) {
		// }
		if (t.isArray()) {
			const text = stripImportPath(typeToText(t.getArrayElementTypeOrThrow(), level + 1)).trim();
			return `${stripImportPath(t.getText())}\n${indent(level + 1)}${
				text.startsWith('*') ? text : `* ${text}`
			}`;
		}

		if (t.getSymbol()?.getName() === 'Promise') {
			const typeArgs = t.getTypeArguments();
			if (typeArgs.length > 0) {
				const text = typeToText(typeArgs[0], level + 1).trim();
				return `${stripImportPath(t.getText())}\n${indent(level + 1)}${
					text.startsWith('*') ? text : `* ${text}`
				}`;
			}
		}
		if (t.isTuple()) {
			const tupleText = t.getText().replace(/\[|\]/g, '').split(',');

			const text = t
				.getTupleElements()
				.map((t, i) => {
					const elementName =
						tupleText.length > i ? `${stripImportPath(tupleText[i].split(':')[0]).trim()}: ` : '';
					return `${elementName}${typeToText(t, level + 1)}`.trim();
				})
				.join(`\n${indent(level + 1)}* `)
				.trim();
			return `\n${indent(level + 1)}${text.startsWith('*') ? text : `* ${text}`}`;
		}

		if (t.isObject()) {
			const properties = t.getProperties();
			const propsText = properties
				.map((prop) => {
					const propName = prop.getName();
					if (['then', 'catch', 'finally', '__@toStringTag@2998'].includes(propName)) {
						return '';
					}

					const propDocs = getPropDocs(prop.getJsDocTags());

					return `${indent(level + 1)}* ${propName}: ${typeToText(
						prop.getValueDeclarationOrThrow().getType(),
						level + 1,
					)}${propDocs.length > 0 ? ` - ${propDocs}` : ''}`;
				})
				.filter((s) => s.trim().length > 2)
				.join(`\n`);
			const typeName = stripImportPath(t.getText());

			if (propsText.length === 0) {
				return `${indent(level)}* ${typeName}`;
			}
			return `\n${
				typeName ? `${indent(level)}* ${typeName}\n${propsText}` : `${indent(level)}* ${propsText}`
			}\n`;
		}
	} catch {}
	return stripImportPath(t.getText());
}

export function paramsToMarkdown(params: ParsedParam[]): string {
	const paramsList = params.reduce(
		(paramMarkdown, param) =>
			paramMarkdown +
			`${param.docs.length > 0 ? `${param.docs}\n` : ''}${SINGLE_INDENT}* ${
				param.name
			}: ${param.type}\n`,
		'',
	);
	return params.length > 0 ? `#### Parameters\n${paramsList}` : '';
}

export function methodToMarkdown(method: ParsedMethod): string {
	return (
		`### ${method.name} <a name="${method.name}"></a>\n` +
		`${method.docs ? method.docs + '\n' : ''}` +
		`${method.tags ? method.tags + '\n' : ''}` +
		paramsToMarkdown(method.params) +
		`#### Returns\n${SINGLE_INDENT}* ${method.returnType}\n` +
		'---\n'
	);
}

export function tableOfContents(parsedInfo: ParsedInfo): string {
	return parsedInfo.reduce((toc, cls) => {
		const classToc = cls.methods.reduce(
			(methodToc, method) =>
				methodToc +
				`* [${method.name}](#${method.name})${method.docs.length > 0 ? ` - ${method.docs}` : ''}\n`,
			'',
		);

		return toc + `## Methods\n${classToc}\n---\n`;
	}, '');
}

export function toMarkdown(parsedInfo: ParsedInfo): string {
	return parsedInfo.reduce((markdown, cls) => {
		const classMarkdown = cls.methods.reduce(
			(methodMarkdown, method) => methodMarkdown + methodToMarkdown(method),
			'',
		);

		return (
			markdown +
			`## ${cls.name}\n${cls.docs}\n${tableOfContents(parsedInfo)}` +
			classMarkdown +
			'\n'
		);
	}, '');
}
