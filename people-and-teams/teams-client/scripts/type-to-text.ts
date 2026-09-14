import { type ts, type Type } from 'ts-morph';

import { getPropDocs } from './get-prop-docs';
import { indent } from './indent';
import { stripImportPath } from './strip-import-path';

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
