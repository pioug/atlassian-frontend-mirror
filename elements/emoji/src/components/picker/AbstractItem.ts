import type { RenderItem, VirtualItem } from './EmojiPickerVirtualItems';

export abstract class AbstractItem<P> implements VirtualItem<P> {
	readonly height: number;
	readonly props: P;

	constructor(props: P, height: number) {
		this.props = props;
		this.height = height;
	}

	abstract renderItem: RenderItem;
}
