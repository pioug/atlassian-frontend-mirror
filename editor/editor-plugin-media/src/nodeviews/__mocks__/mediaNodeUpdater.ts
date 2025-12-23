export class MediaNodeUpdater {
	static instances: MediaNodeUpdater[] = [];
	static mockOverrides = {};
	static mockReset(): void {
		this.instances.length = 0;
		MediaNodeUpdater.mockOverrides = {};
	}

	constructor() {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const mockOverrides = MediaNodeUpdater.mockOverrides as any;
		this.setProps = mockOverrides['setProps'] || jest.fn();
		jest.fn().mockResolvedValue(undefined);
		this.updateContextId =
			mockOverrides['updateContextId'] || jest.fn().mockResolvedValue(undefined);
		this.updateNodeContextId =
			mockOverrides['updateNodeContextId'] || jest.fn().mockResolvedValue(undefined);
		this.getAttrs = mockOverrides['getAttrs'] || jest.fn();
		this.getObjectId = mockOverrides['getObjectId'] || jest.fn().mockResolvedValue(undefined);
		this.getNodeContextId = mockOverrides['getNodeContextId'] || jest.fn();
		this.updateDimensions = mockOverrides['updateDimensions'] || jest.fn();
		this.getRemoteDimensions =
			mockOverrides['getRemoteDimensions'] || jest.fn().mockResolvedValue(undefined);
		this.isNodeFromDifferentCollection =
			mockOverrides['isNodeFromDifferentCollection'] || jest.fn().mockResolvedValue(true);
		this.hasDifferentContextId =
			mockOverrides['hasDifferentContextId'] || jest.fn().mockResolvedValue(true);
		this.shouldNodeBeDeepCopied =
			mockOverrides['shouldNodeBeDeepCopied'] || jest.fn().mockResolvedValue(true);
		this.copyNode = mockOverrides['copyNode'] || jest.fn().mockResolvedValue(undefined);
		this.copyNodeFromPos =
			mockOverrides['copyNodeFromPos'] || jest.fn().mockResolvedValue(undefined);
		this.updateMediaSingleFileAttrs = mockOverrides['updateMediaSingleFileAttrs'] || jest.fn();
		MediaNodeUpdater.instances.push(this);
		this.uploadExternalMedia =
			mockOverrides['uploadExternalMedia'] || jest.fn().mockResolvedValue(undefined);
		this.isMediaBlobUrl = mockOverrides['isMediaBlobUrl'] || jest.fn().mockResolvedValue(undefined);
		this.copyNodeFromBlobUrl =
			mockOverrides['copyNodeFromBlobUrl'] || jest.fn().mockResolvedValue(undefined);
		this.handleExternalMedia =
			mockOverrides['handleExternalMedia'] || jest.fn().mockResolvedValue(undefined);
		this.updateNodeAttrs =
			mockOverrides['updateNodeAttrs'] || jest.fn().mockResolvedValue(undefined);
	}

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static setMock(thisKey: string, value: any): void {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(MediaNodeUpdater.mockOverrides as any)[thisKey] = value;
	}

	setProps(): void {}
	async updateContextId(): Promise<void> {}
	async updateNodeContextId(): Promise<void> {}
	getAttrs(): void {}
	async getObjectId(): Promise<void> {}
	getNodeContextId(): void {}
	updateDimensions(): void {}
	async getRemoteDimensions(): Promise<void> {}
	async isNodeFromDifferentCollection(): Promise<void> {}
	async hasDifferentContextId(): Promise<void> {}
	async shouldNodeBeDeepCopied(): Promise<void> {}
	async copyNode(): Promise<void> {}
	async copyNodeFromPos(): Promise<void> {}
	async updateMediaSingleFileAttrs(): Promise<void> {}
	async uploadExternalMedia(): Promise<void> {}
	isMediaBlobUrl(): void {}
	copyNodeFromBlobUrl(): void {}
	updateNodeAttrs(): void {}
	async handleExternalMedia(): Promise<void> {}
}

export function createMediaNodeUpdater() {
	return new MediaNodeUpdater();
}
