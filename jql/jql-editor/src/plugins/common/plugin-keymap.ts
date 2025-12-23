import { type JQLEditorKeymap } from '../../schema';

export class PluginKeymap {
	private keymap: JQLEditorKeymap = {};

	bindKey(key: string, handler: () => boolean): void {
		this.keymap = {
			...this.keymap,
			[key]: handler,
		};
	}

	bindMultipleKeys(keys: string[], handler: () => boolean): void {
		keys.forEach((key) => {
			this.keymap = {
				...this.keymap,
				[key]: handler,
			};
		});
	}

	unbindKey(key: string): void {
		const { [key]: keyToUnbind, ...rest } = this.keymap;
		this.keymap = rest;
	}

	getKeyBinding(key: string) {
		return this.keymap[key];
	}
}
