import {
	type Argument,
	type AstNode,
	type JastListener,
	type JastVisitor,
	type Position,
	type Property,
} from '../types';

import { assignParent } from './common';

function acceptProperty<Result>(this: Property, visitor: JastVisitor<Result>) {
	return visitor.visitProperty ? visitor.visitProperty(this) : visitor.visitChildren(this);
}

function enterNode(this: Property, listener: JastListener): void {
	listener.enterProperty && listener.enterProperty(this);
}

function exitNode(this: Property, listener: JastListener): void {
	listener.exitProperty && listener.exitProperty(this);
}

function getChildren(this: Property): AstNode[] {
	const children: AstNode[] = [];
	if (this.key) {
		children.push(this.key);
	}
	if (this.path) {
		return children.concat(this.path);
	}
	return children;
}

export const property = (key: Argument | void, path: Argument[] = []): Property =>
	propertyInternal(key, path);

export const propertyInternal = (
	key: Argument | void,
	path: Argument[],
	position: Position | null = null,
): Property => {
	const node: Property = {
		key,
		path,
		position,
		accept: acceptProperty,
		enterNode,
		exitNode,
		getChildren,
		parent: null,
	};

	assignParent(node);

	return node;
};
