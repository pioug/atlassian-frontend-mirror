import { readFileSync } from 'fs';

export function readJsonFile(filePath: string): unknown {
	const content = readFileSync(filePath, 'utf8');
	return JSON.parse(content);
}
