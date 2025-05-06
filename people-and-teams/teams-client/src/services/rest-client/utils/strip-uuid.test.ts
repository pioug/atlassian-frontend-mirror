import { stripUUIDFromPath } from './strip-uuid';

describe('parsePath', () => {
	it('should strip UUIDs from path', () => {
		const path = '/api/v4/teams/f59dc331-c3c2-4082-8c0d-37650295f887/membership/me';
		const expectedPath = '/api/v4/teams/<UUID>/membership/me';
		expect(stripUUIDFromPath(path)).toEqual(expectedPath);
	});
});
