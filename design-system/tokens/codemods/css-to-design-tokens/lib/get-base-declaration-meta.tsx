import type { Declaration, Node, Rule } from 'postcss';

function getPropertyMeta(prop: string) {
	if (prop === 'color') {
		return 'text';
	}

	if (prop.startsWith('background')) {
		return 'background';
	}

	if (prop.includes('shadow')) {
		return 'shadow';
	}

	if (prop.includes('border')) {
		return 'border';
	}

	return '';
}

function isRule(node: Node): node is Rule {
	return node.type === 'rule';
}

function getParentSelectors(node: Node): string {
	if (isRule(node)) {
		// @ts-expect-error
		return getParentSelectors(node.parent) + ' ' + node.selector;
	}

	if (node.parent) {
		return getParentSelectors(node.parent);
	}

	return '';
}

export function getBaseDeclarationMeta(decl: Declaration): string[] {
	const parentSelectors = getParentSelectors(decl)
		.split(/\-|\.|\,|\ |\:|\&/)
		.filter(Boolean);

	return [getPropertyMeta(decl.prop), ...parentSelectors];
}
