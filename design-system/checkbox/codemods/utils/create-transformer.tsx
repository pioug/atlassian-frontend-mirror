import { type API, type FileInfo, type JSCodeshift, type Options } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

import { hasImportDeclaration } from './has-import-declaration';

export const createTransformer: (
	component: string,
	migrates: {
		(j: JSCodeshift, source: Collection<Node>): void;
	}[],
) => (fileInfo: FileInfo, { jscodeshift }: API, options: Options) => string =
	(component: string, migrates: { (j: JSCodeshift, source: Collection<Node>): void }[]) =>
	(fileInfo: FileInfo, { jscodeshift }: API, options: Options) => {
		const source: Collection<Node> = jscodeshift(fileInfo.source);

		if (!hasImportDeclaration(jscodeshift, source, component)) {
			return fileInfo.source;
		}

		migrates.forEach((tf) => tf(jscodeshift, source));

		return source.toSource(options.printOptions || { quote: 'single' });
	};
