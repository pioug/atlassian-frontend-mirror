export class MediaNodeUpdater {
	static instances: MediaNodeUpdater[] = [];
	static mockOverrides = {};
	static mockReset() {
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
			mockOverrides['handleExternalMedia'] || jest.fn().mockReturnValue(new Promise(() => {}));
		this.updateNodeAttrs =
			mockOverrides['updateNodeAttrs'] || jest.fn().mockReturnValue(new Promise(() => {}));
	}

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static setMock(thisKey: string, value: any) {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(MediaNodeUpdater.mockOverrides as any)[thisKey] = value;
	}

	setProps() {}
	async updateContextId() {}
	async updateNodeContextId() {}
	getAttrs() {}
	async getObjectId() {}
	getNodeContextId() {}
	updateDimensions() {}
	async getRemoteDimensions() {}
	async isNodeFromDifferentCollection() {}
	async hasDifferentContextId() {}
	async copyNode() {}
	async copyNodeFromPos() {}
	async updateMediaSingleFileAttrs() {}
	async uploadExternalMedia() {}
	isMediaBlobUrl() {}
	copyNodeFromBlobUrl() {}
	updateNodeAttrs() {}
	async handleExternalMedia() {}
}
