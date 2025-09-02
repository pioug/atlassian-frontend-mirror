import { getTeamAvatarSrc } from './utils';

describe('getTeamAvatarSrc', () => {
	it('should return src if src is provided', () => {
		expect(getTeamAvatarSrc('https://example.com')).toBe('https://example.com');
	});

	it('should return generated URL if teamId is provided and src is not', () => {
		expect(getTeamAvatarSrc(undefined, 'team-123')).toBe('/gateway/api/v4/teams/team-123/avatar');
	});

	it('should return undefined if no params are provided', () => {
		expect(getTeamAvatarSrc()).toBeUndefined();
	});

	it('should use src in favour of teamId', () => {
		expect(getTeamAvatarSrc('https://example.com', 'team-123')).toBe('https://example.com');
	});
});
