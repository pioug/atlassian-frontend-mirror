import { type JQLEditorKeymap } from '../../schema';

export class PluginKeymap {
	private keymap: JQLEditorKeymap = {};

	bindKey(key: string, handler: () => boolean) {
		this.keymap = {
			...this.keymap,
			[key]: handler,
		};
	}

	bindMultipleKeys(keys: string[], handler: () => boolean) {
		keys.forEach((key) => {
			this.keymap = {
				...this.keymap,
				[key]: handler,
			};
		});
	}

	unbindKey(key: string) {
		const { [key]: keyToUnbind, ...rest } = this.keymap;
		this.keymap = rest;
	}

	getKeyBinding(key: string) {
		return this.keymap[key];
	}
}
