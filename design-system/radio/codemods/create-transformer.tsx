import { type API, type FileInfo, type JSCodeshift, type Options } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

import { hasImportDeclaration } from './has-import-declaration';

export const createTransformer: (
	component: string,
	migrates: {
		(j: JSCodeshift, source: Collection<Node>): void;
	}[],
) => (fileInfo: FileInfo, api: API, options: Options) => string =
	(component: string, migrates: { (j: JSCodeshift, source: Collection<Node>): void }[]) =>
	(fileInfo: FileInfo, { jscodeshift: j }: API, options: Options) => {
		const source: Collection<Node> = j(fileInfo.source);

		if (!hasImportDeclaration(j, source, component)) {
			return fileInfo.source;
		}

		migrates.forEach((tf) => tf(j, source));

		return source.toSource(options.printOptions || { quote: 'single' });
	};
