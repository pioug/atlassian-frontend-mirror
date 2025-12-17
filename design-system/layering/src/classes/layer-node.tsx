export class LayerNode {
	id: string;
	childNodes: LayerNode[];
	parent: LayerNode | null;

	constructor(id: string, parent: LayerNode | null) {
		this.id = id;
		this.childNodes = [];
		this.parent = parent;
	}

	addChild(node: LayerNode): void {
		this.childNodes.push(node);
	}

	removeChild(node: LayerNode): void {
		this.childNodes = this.childNodes.filter((child) => child.id !== node.id);
	}

	getLevel(): number {
		if (!this.parent) {
			return 1;
		}
		return this.parent.getLevel() + 1;
	}

	getHeight(): number {
		if (this.childNodes.length === 0) {
			return 1;
		}
		return Math.max(...this.childNodes.map((child) => child.getHeight())) + 1;
	}
}
