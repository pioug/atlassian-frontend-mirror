// this isn't implemented by JSDOM so we've implemented it to make Typescript happy
// see https://github.com/tmpvar/jsdom/issues/1568
// TODO: remove this `Omit` usage once TS fixes File class regression.
// https://github.com/microsoft/TypeScript/issues/52166
// @ts-ignore - TS2420 TypeScript 5.9.2 upgrade
export class ClipboardMockFile implements Omit<File, 'constructor'> {
	readonly size: number;
	readonly type: string;
	readonly lastModified: number = 1234;
	readonly lastModifiedDate: any;
	readonly name: string;
	readonly webkitRelativePath: string;
	msClose(): void {}
	msDetachStream(): any {}
	slice(): Blob {
		throw new Error('not implemented');
	}
	// TODO: remove this property once TS fixes File class regression.
	// https://github.com/microsoft/TypeScript/issues/52166
	prototype: File = File.prototype;

	constructor(
		options: { type: string; name: string } = {
			type: '',
			name: 'some-file.png',
		},
	) {
		this.type = options.type;
		this.name = options.name;
		this.size = 0;
		this.webkitRelativePath = '';
	}
	arrayBuffer(): Promise<ArrayBuffer> {
		return Promise.resolve(new ArrayBuffer(0));
	}
	// @ts-ignore: https://github.com/microsoft/TypeScript/issues/52166
	stream(): ReadableStream<any> {
		// IE11 compat
		// eslint-disable-next-line compat/compat
		return new ReadableStream({
			start(controller) {
				controller.close();
			},
		});
	}
	text(): Promise<string> {
		return Promise.resolve('');
	}
}

// this isn't implemented by JSDOM so we've implemented it to make Typescript happy
// see https://github.com/tmpvar/jsdom/issues/1568
export class MockFileList extends Array<File> {
	item(index: number): File {
		return this[index];
	}

	static fromArray(files: File[]): MockFileList {
		const list = new MockFileList();
		files.forEach((file) => list.push(file));
		return list;
	}
}

// this isn't implemented by JSDOM so we've implemented it to make Typescript happy
// see https://github.com/tmpvar/jsdom/issues/1568
export class MockDataTransfer implements DataTransfer {
	constructor(
		readonly files: FileList,
		readonly types: string[] = [],
		readonly items: DataTransferItemList = [] as any,
		readonly dropEffect: DataTransfer['dropEffect'] = 'none',
		readonly effectAllowed: DataTransfer['effectAllowed'] = 'none',
	) {}

	clearData(): boolean {
		return false;
	}
	getData(): string {
		return '';
	}
	setData(): boolean {
		return false;
	}
	setDragImage(): void {}
}

// this isn't implemented by JSDOM, and JSDOM .dispatchEvent() requires that event is an instanceof event,
// so we've implemented it to make Typescript happy
// see https://github.com/tmpvar/jsdom/issues/1568
export const getMockClipboardEvent = (): {
	new (
		event: string,
		files?: File[],
		types?: string[],
	): {
		clipboardData: DataTransfer;
		readonly bubbles: boolean;
		cancelBubble: boolean;
		readonly cancelable: boolean;
		readonly composed: boolean;
		readonly currentTarget: EventTarget | null;
		readonly defaultPrevented: boolean;
		readonly eventPhase: number;
		readonly isTrusted: boolean;
		returnValue: boolean;
		readonly srcElement: EventTarget | null;
		readonly target: EventTarget | null;
		readonly timeStamp: DOMHighResTimeStamp;
		readonly type: string;
		composedPath(): EventTarget[];
		initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void;
		preventDefault(): void;
		stopImmediatePropagation(): void;
		stopPropagation(): void;
		readonly NONE: 0;
		readonly CAPTURING_PHASE: 1;
		readonly AT_TARGET: 2;
		readonly BUBBLING_PHASE: 3;
	};
	readonly NONE: 0;
	readonly CAPTURING_PHASE: 1;
	readonly AT_TARGET: 2;
	readonly BUBBLING_PHASE: 3;
} =>
	class MockClipboardEvent extends Event implements ClipboardEvent {
		clipboardData: DataTransfer;
		constructor(event: string, files: File[] = [], types: string[] = []) {
			super(event);
			this.clipboardData = new MockDataTransfer(MockFileList.fromArray(files), types);
		}
	};

export const MockDragEvent = (): {
	new (
		event: string,
		files?: File[],
	): {
		dataTransfer: DataTransfer;
		initDragEvent(): void;
		msConvertURL(): void;
		readonly altKey: boolean;
		readonly button: number;
		readonly buttons: number;
		readonly clientX: number;
		readonly clientY: number;
		readonly ctrlKey: boolean;
		readonly layerX: number;
		readonly layerY: number;
		readonly metaKey: boolean;
		readonly movementX: number;
		readonly movementY: number;
		readonly offsetX: number;
		readonly offsetY: number;
		readonly pageX: number;
		readonly pageY: number;
		readonly relatedTarget: EventTarget | null;
		readonly screenX: number;
		readonly screenY: number;
		readonly shiftKey: boolean;
		readonly x: number;
		readonly y: number;
		getModifierState(keyArg: string): boolean;
		initMouseEvent(
			typeArg: string,
			canBubbleArg: boolean,
			cancelableArg: boolean,
			viewArg: Window,
			detailArg: number,
			screenXArg: number,
			screenYArg: number,
			clientXArg: number,
			clientYArg: number,
			ctrlKeyArg: boolean,
			altKeyArg: boolean,
			shiftKeyArg: boolean,
			metaKeyArg: boolean,
			buttonArg: number,
			relatedTargetArg: EventTarget | null,
		): void;
		readonly detail: number;
		readonly view: Window | null;
		readonly which: number;
		initUIEvent(
			typeArg: string,
			bubblesArg?: boolean,
			cancelableArg?: boolean,
			viewArg?: Window | null,
			detailArg?: number,
		): void;
		readonly bubbles: boolean;
		cancelBubble: boolean;
		readonly cancelable: boolean;
		readonly composed: boolean;
		readonly currentTarget: EventTarget | null;
		readonly defaultPrevented: boolean;
		readonly eventPhase: number;
		readonly isTrusted: boolean;
		returnValue: boolean;
		readonly srcElement: EventTarget | null;
		readonly target: EventTarget | null;
		readonly timeStamp: DOMHighResTimeStamp;
		readonly type: string;
		composedPath(): EventTarget[];
		initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void;
		preventDefault(): void;
		stopImmediatePropagation(): void;
		stopPropagation(): void;
		readonly NONE: 0;
		readonly CAPTURING_PHASE: 1;
		readonly AT_TARGET: 2;
		readonly BUBBLING_PHASE: 3;
	};
} =>
	class MockDragEvent extends MouseEvent implements DragEvent {
		dataTransfer: DataTransfer;
		constructor(event: string, files: File[] = []) {
			super(event);
			this.dataTransfer = new MockDataTransfer(MockFileList.fromArray(files));
		}
		initDragEvent(): void {
			// noop
		}
		msConvertURL(): void {
			// noop
		}
	};
