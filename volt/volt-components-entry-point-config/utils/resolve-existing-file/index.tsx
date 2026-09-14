import { realpathSync, statSync } from 'fs';
import { join } from 'path';

const SOURCE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'] as const;

export function resolveExistingFile(absolutePath: string): string | null {
	if (fileExists(absolutePath)) {
		return realpathSafe(absolutePath);
	}

	for (const extension of SOURCE_EXTENSIONS) {
		const withExt = absolutePath + extension;
		if (fileExists(withExt)) {
			return realpathSafe(withExt);
		}
	}

	for (const extension of SOURCE_EXTENSIONS) {
		const indexPath = join(absolutePath, 'index' + extension);
		if (fileExists(indexPath)) {
			return realpathSafe(indexPath);
		}
	}

	return null;
}

function fileExists(filePath: string): boolean {
	try {
		return statSync(filePath).isFile();
	} catch {
		return false;
	}
}

function realpathSafe(filePath: string): string {
	try {
		return realpathSync(filePath);
	} catch {
		return filePath;
	}
}
