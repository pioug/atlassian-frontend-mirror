import { isDecendantOfType } from '@hypermod/utils';
import type { ASTPath, JSCodeshift } from 'jscodeshift';

export function getClosestDecendantOfType(j: JSCodeshift, path: ASTPath<any>, type: any): any {
	if (!isDecendantOfType(j, path, type)) {
		return;
	}

	return j(path).closest(type).get();
}
