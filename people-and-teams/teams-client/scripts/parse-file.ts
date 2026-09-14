import { Project } from 'ts-morph';

import { parseMethod } from './parse-method';
import type { ParsedInfo } from './parsed-info';

// Initialize a Project
const project = new Project();

export function parseFile(path: string): ParsedInfo {
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
