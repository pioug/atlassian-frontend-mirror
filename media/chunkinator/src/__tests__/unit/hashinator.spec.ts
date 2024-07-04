import { toArray } from 'rxjs/operators/toArray';
import { of } from 'rxjs/observable/of';
import { type HashedBlob } from '../../domain';
import { hashinator, blobToHashedBlob } from '../../hashinator';

const crypto = {
	subtle: {
		digest: jest.fn(),
	},
};

function str2ab(str: string) {
	const buf = new ArrayBuffer(str.length); // 2 bytes for each char
	const bufView = new Uint8Array(buf);
	for (let i = 0, strLen = str.length; i < strLen; i++) {
		bufView[i] = str.charCodeAt(i);
	}
	return buf;
}

function mockNextDigest(input: string) {
	let buffer = new Uint8Array(str2ab(input)).buffer;
	(crypto.subtle.digest as jest.Mock).mockReturnValueOnce(buffer);
}

describe('Hashinator', () => {
	beforeEach(() => {
		(crypto.subtle.digest as jest.Mock).mockReset();
	});

	describe('#blobToHashedBlob', () => {
		it('should convert blob to hashed blob', () => {
			const blob = new Blob(['1234567890']);
			mockNextDigest('1234567890');
			return blobToHashedBlob(async (_blog) => 'fakeHash')({
				blob: blob,
				partNumber: 1,
			}).then((hashedBlob) => {
				expect(hashedBlob).toEqual({
					blob,
					hash: 'fakeHash-10',
					partNumber: 1,
				});
			});
		});
	});

	it('should hash chunks', () => {
		const expectedHashedBlobs: HashedBlob[] = [
			{
				blob: new Blob(['1234567890']),
				hash: 'fakeHash0-10',
				partNumber: 1,
			},
			{
				blob: new Blob(['0987654321']),
				hash: 'fakeHash1-10',
				partNumber: 2,
			},
			{
				blob: new Blob(['qwertyuiop']),
				hash: 'fakeHash2-10',
				partNumber: 3,
			},
			{
				blob: new Blob(['asdfghjkl;']),
				hash: 'fakeHash3-10',
				partNumber: 4,
			},
			{
				blob: new Blob(['zxcvbnm,./']),
				hash: 'fakeHash4-10',
				partNumber: 5,
			},
		];

		mockNextDigest('1234567890');
		mockNextDigest('0987654321');
		mockNextDigest('qwertyuiop');
		mockNextDigest('asdfghjkl;');
		mockNextDigest('zxcvbnm,./');

		const blobs = expectedHashedBlobs.map((hashedBlob, index) => ({
			blob: hashedBlob.blob,
			partNumber: index + 1,
		}));
		let counter = 0;
		const actualObservable = hashinator(of(...blobs), {
			hasher: async (_blob) => 'fakeHash' + counter++,
			concurrency: 2,
		});
		return actualObservable
			.pipe(toArray<HashedBlob>())
			.toPromise()
			.then((actualHashedBlobs) => {
				expect(actualHashedBlobs).toEqual(expectedHashedBlobs);
			});
	});
});
