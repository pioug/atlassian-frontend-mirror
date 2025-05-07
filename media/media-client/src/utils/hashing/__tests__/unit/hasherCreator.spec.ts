jest.mock('../../simpleHasher');
jest.mock('../../sha256SimpleHasher');

import { SimpleHasher } from '../../simpleHasher';
import { SimpleHasher as Sha256SimpleHasher } from '../../sha256SimpleHasher';

import { createHasher, destroyHashers } from '../../hasherCreator';
import { ChunkHashAlgorithm } from '@atlaskit/media-core';

describe('createHasher', () => {
	const SimpleHasherStub: jest.Mock<SimpleHasher> = SimpleHasher as any;
	const Sha256SimpleHasherStub: jest.Mock<Sha256SimpleHasher> = Sha256SimpleHasher as any;

	beforeEach(() => {
		destroyHashers();
		SimpleHasherStub.mockReset();
		Sha256SimpleHasherStub.mockReset();
	});

	it('should create Sha256SimpleHasher', async () => {
		const hasher = await createHasher(ChunkHashAlgorithm.Sha256);
		expect(hasher).toEqual(Sha256SimpleHasherStub.mock.instances[0]);
	});

	it('should create SimpleHasher if Sha256SimpleHasher throws an exception', async () => {
		Sha256SimpleHasherStub.mockImplementation(() => {
			throw new Error('some-error');
		});

		const hasher = await createHasher(ChunkHashAlgorithm.Sha256);
		expect(hasher).toEqual(SimpleHasherStub.mock.instances[0]);
	});
});
