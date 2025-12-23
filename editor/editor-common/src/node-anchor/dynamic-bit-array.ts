const DEFAULT_CHUNK_SIZE = 4096; // Default chunk size in bits

/**
 * A dynamic bit array implementation that allows for efficient storage and manipulation of bits.
 * It supports dynamic resizing and provides methods for setting and getting bit values.
 * This is useful for scenarios where you need to manage a large number of boolean flags efficiently.
 */
export class DynamicBitArray {
	private chunkSize: number;
	private chunkTotalBitSize: number;
	private bitArrays: Uint8Array[];

	constructor(chunkSize = DEFAULT_CHUNK_SIZE) {
		this.chunkSize = chunkSize;
		this.chunkTotalBitSize = this.chunkSize * 8;
		this.bitArrays = [];
	}

	public set(index: number, value: boolean): void {
		const bitArray = this.getChunk(index);
		const byteOffset = index % this.chunkTotalBitSize;
		const byteIndex = Math.floor(byteOffset / 8); // Get the byte index
		const bitOffset = byteOffset % 8; // Get the bit offset within the byte

		if (value) {
			bitArray[byteIndex] |= 1 << bitOffset; // set the bit
		} else {
			bitArray[byteIndex] &= ~(1 << bitOffset); // clear the bit
		}
	}

	public get(index: number): boolean {
		const bitArray = this.getChunk(index);
		const byteOffset = index % this.chunkTotalBitSize;
		const byteIndex = Math.floor(byteOffset / 8); // Get the byte index
		const bitOffset = byteOffset % 8; // Get the bit offset within the byte

		return (bitArray[byteIndex] & (1 << bitOffset)) !== 0; // Check if the bit is set
	}

	private getChunk(index: number) {
		const chunkIndex = Math.floor(index / this.chunkTotalBitSize);
		if (!this.bitArrays[chunkIndex]) {
			this.bitArrays[chunkIndex] = new Uint8Array(this.chunkSize);
		}

		return this.bitArrays[chunkIndex];
	}
}
