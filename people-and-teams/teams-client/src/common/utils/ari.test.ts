import { TEAM_ARI_PREFIX, USER_ARI_PREFIX } from '../types';
import { isTeamARI } from './is-team-ari';
import { isUserARI } from './is-user-ari';
import { toTeamARI } from './to-team-ari';
import { toTeamId } from './to-team-id';
import { toUserARI } from './to-user-ari';
import { toUserId } from './to-user-id';

describe('ARIs', () => {
	describe.each([
		['UserARI', isUserARI, toUserId, toUserARI, USER_ARI_PREFIX],
		['TeamARI', isTeamARI, toTeamId, toTeamARI, TEAM_ARI_PREFIX],
	])('%s', (name, isARI, toId, toARI, prefix) => {
		it('should correctly identify', () => {
			const ari = `${prefix}12345`;

			expect(isARI(ari)).toBeTruthy();
			expect(isARI('invalid:ari:bad/12345')).toBeFalsy();
		});

		it('should convert a to ID', () => {
			const ari = `${prefix}12345`;
			const id = toId(ari);

			expect(id).toEqual('12345');
		});

		it('should throw an error when trying to convert an invalid ARI to an ID', () => {
			const invalidUserAri = 'invalid:ari:user/12345';

			expect(() => toUserId(invalidUserAri)).toThrow('Invalid UserARI');
		});

		it('should convert an ID to an ARI', () => {
			const id = '12345';
			const ARI = toARI(id);

			expect(ARI).toEqual(`${prefix}12345`);
		});

		it('should not convert a UserARI when passed to toARI', () => {
			const input = `${prefix}12345`;
			const ARI = toARI(input);

			expect(ARI).toEqual(input);
		});

		it('should be able to reverse the conversion from ARI to an ID and back', () => {
			const input = `${prefix}12345`;
			const id = toId(input);
			const ARI = toARI(id);

			expect(ARI).toEqual(input);
		});

		it('should be able to reverse the conversion from user ID to UserARI and back', () => {
			const id = '12345';
			const ARI = toARI(id);
			const newId = toId(ARI);

			expect(newId).toEqual(id);
		});
	});
});
