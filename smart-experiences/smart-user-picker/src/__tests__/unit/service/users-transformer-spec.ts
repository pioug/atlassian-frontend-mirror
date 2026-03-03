import { transformUsers } from '../../../service/users-transformer';
import { EntityType } from '../../../types';
import { UserType, ExternalUserType, TeamType, GroupType } from '@atlaskit/user-picker';
import type { IntlShape } from 'react-intl-next';

jest.mock('@atlaskit/platform-feature-flags');

import { fg } from '@atlaskit/platform-feature-flags';

const mockIntl: IntlShape = {
	formatMessage: jest.fn((descriptor) => {
		const messages: Record<string, string> = {
			'fabric.elements.user-picker.member.lozenge.text': 'MEMBER',
			'fabric.elements.user-picker.guest.lozenge.text': 'GUEST',
			'fabric.elements.user-picker.guest.lozenge.tooltip.user':
				'Guests can only access certain spaces and have limited access to user info.',
			'fabric.elements.user-picker.guest.lozenge.tooltip.group':
				'Guest groups can only access certain spaces and have limited access to user info.',
		};
		return messages[descriptor.id] || descriptor.defaultMessage || '';
	}),
} as any;

describe('users-transformer', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(fg as jest.Mock).mockReturnValue(false);
	});

	describe('transformUsers', () => {
		it('should transform empty array', () => {
			const serverResponse = {
				recommendedUsers: [],
				intl: mockIntl,
			};

			const result = transformUsers(serverResponse, mockIntl);

			expect(result).toEqual([]);
		});

		it('should transform a regular user', () => {
			const serverResponse = {
				recommendedUsers: [
					{
						id: 'user-1',
						name: 'John Doe',
						entityType: EntityType.USER,
						avatarUrl: 'https://avatar.url/user1.jpg',
						email: 'john@example.com',
						title: 'Software Engineer',
					},
				],
				intl: mockIntl,
			};

			const result = transformUsers(serverResponse, mockIntl);

			expect(result).toEqual([
				{
					id: 'user-1',
					type: UserType,
					userType: undefined,
					avatarUrl: 'https://avatar.url/user1.jpg',
					name: 'John Doe',
					email: 'john@example.com',
					title: 'Software Engineer',
					lozenge: undefined,
					tooltip: 'John Doe',
					isExternal: false,
					sources: undefined,
				},
			]);
		});

		it('should transform a non-licensed user as external user', () => {
			const serverResponse = {
				recommendedUsers: [
					{
						id: 'user-2',
						name: 'Jane Smith',
						entityType: EntityType.USER,
						avatarUrl: 'https://avatar.url/user2.jpg',
						email: 'jane@example.com',
						nonLicensedUser: true,
					},
				],
				intl: mockIntl,
			};

			const result = transformUsers(serverResponse, mockIntl);

			expect(result).toEqual([
				{
					id: 'user-2',
					type: ExternalUserType,
					userType: undefined,
					avatarUrl: 'https://avatar.url/user2.jpg',
					name: 'Jane Smith',
					email: 'jane@example.com',
					title: undefined,
					lozenge: undefined,
					tooltip: 'Jane Smith',
					isExternal: true,
					sources: ['other-atlassian'],
				},
			]);
		});

		it('should add workspace member lozenge for users with workspaceMember attribute', () => {
			const serverResponse = {
				recommendedUsers: [
					{
						id: 'user-3',
						name: 'Bob Member',
						entityType: EntityType.USER,
						avatarUrl: 'https://avatar.url/user3.jpg',
						attributes: {
							workspaceMember: 'true',
						},
					},
				],
				intl: mockIntl,
			};

			const result = transformUsers(serverResponse, mockIntl);

			expect(result[0].lozenge).toBe('MEMBER');
			expect(mockIntl.formatMessage).toHaveBeenCalledWith(
				expect.objectContaining({
					id: 'fabric.elements.user-picker.member.lozenge.text',
				}),
			);
		});

		it('should add guest lozenge with tooltip for Confluence external collaborator users', () => {
			const serverResponse = {
				recommendedUsers: [
					{
						id: 'user-4',
						name: 'Guest User',
						entityType: EntityType.USER,
						avatarUrl: 'https://avatar.url/user4.jpg',
						attributes: {
							isConfluenceExternalCollaborator: 'true',
						},
					},
				],
				intl: mockIntl,
			};

			const result = transformUsers(serverResponse, mockIntl);

			expect(result[0].lozenge).toEqual({
				text: 'GUEST',
				tooltip: 'Guests can only access certain spaces and have limited access to user info.',
				appearance: 'default',
			});
		});

		it('should add guest lozenge for Jira guest users when feature flag is enabled', () => {
			(fg as jest.Mock).mockImplementation((flag: string) => {
				return flag === 'user_picker_guest_lozenges';
			});

			const serverResponse = {
				recommendedUsers: [
					{
						id: 'user-5',
						name: 'Jira Guest',
						entityType: EntityType.USER,
						avatarUrl: 'https://avatar.url/user5.jpg',
						attributes: {
							isJiraGuest: 'true',
						},
					},
				],
				intl: mockIntl,
			};

			const result = transformUsers(serverResponse, mockIntl);

			expect(result[0].lozenge).toBe('GUEST');
			expect(fg).toHaveBeenCalledWith('user_picker_guest_lozenges');
		});

		it('should not add guest lozenge for Jira guest users when feature flag is disabled', () => {
			(fg as jest.Mock).mockReturnValue(false);

			const serverResponse = {
				recommendedUsers: [
					{
						id: 'user-6',
						name: 'Jira Guest',
						entityType: EntityType.USER,
						avatarUrl: 'https://avatar.url/user6.jpg',
						attributes: {
							isJiraGuest: 'true',
						},
					},
				],
				intl: mockIntl,
			};

			const result = transformUsers(serverResponse, mockIntl);

			expect(result[0].lozenge).toBeUndefined();
		});

		it('should transform a team', () => {
			const serverResponse = {
				recommendedUsers: [
					{
						id: 'team-1',
						entityType: EntityType.TEAM,
						avatarUrl: 'https://avatar.url/team-large.jpg',
						description: 'The engineering team',
						displayName: 'Engineering Team',
					},
				],
				intl: mockIntl,
			};

			const result = transformUsers(serverResponse, mockIntl);

			expect(result).toEqual([
				{
					id: 'team-1',
					type: TeamType,
					description: 'The engineering team',
					name: 'Engineering Team',
					tooltip: 'Engineering Team',
				},
			]);
		});

		it('should transform a group', () => {
			const serverResponse = {
				recommendedUsers: [
					{
						id: 'group-1',
						name: 'Admins',
						entityType: EntityType.GROUP,
						avatarUrl: 'https://avatar.url/group1.jpg',
					},
				],
				intl: mockIntl,
			};

			const result = transformUsers(serverResponse, mockIntl);

			expect(result).toEqual([
				{
					id: 'group-1',
					type: GroupType,
					name: 'Admins',
					lozenge: undefined,
				},
			]);
		});

		it('should add guest lozenge with tooltip for Confluence external collaborator groups', () => {
			const serverResponse = {
				recommendedUsers: [
					{
						id: 'group-2',
						name: 'Guest Group',
						entityType: EntityType.GROUP,
						avatarUrl: 'https://avatar.url/group2.jpg',
						attributes: {
							isConfluenceExternalCollaborator: 'true',
						},
					},
				],
				intl: mockIntl,
			};

			const result = transformUsers(serverResponse, mockIntl);

			expect(result[0].lozenge).toEqual({
				text: 'GUEST',
				tooltip:
					'Guest groups can only access certain spaces and have limited access to user info.',
				appearance: 'default',
			});
		});

		it('should filter out invalid entity types', () => {
			const serverResponse = {
				recommendedUsers: [
					{
						id: 'user-1',
						name: 'Valid User',
						entityType: EntityType.USER,
						avatarUrl: 'https://avatar.url/user1.jpg',
					},
					{
						id: 'invalid-1',
						name: 'Invalid Entity',
						entityType: 'INVALID' as any,
						avatarUrl: 'https://avatar.url/invalid.jpg',
					},
				],
				intl: mockIntl,
			};

			const result = transformUsers(serverResponse, mockIntl);

			expect(result).toHaveLength(1);
			expect(result[0].id).toBe('user-1');
		});

		it('should handle mixed entity types', () => {
			const serverResponse = {
				recommendedUsers: [
					{
						id: 'user-1',
						displayName: 'User One',
						entityType: EntityType.USER,
						avatarUrl: 'https://avatar.url/user1.jpg',
					},
					{
						id: 'team-1',
						displayName: 'Team One',
						entityType: EntityType.TEAM,
						avatarUrl: 'https://avatar.url/user1.jpg',
					},
					{
						id: 'group-1',
						name: 'Group One',
						entityType: EntityType.GROUP,
						avatarUrl: 'https://avatar.url/group1.jpg',
					},
				],
				intl: mockIntl,
			};

			const result = transformUsers(serverResponse, mockIntl);

			expect(result).toHaveLength(3);
			expect(result[0].type).toBe(UserType);
			expect(result[1].type).toBe(TeamType);
			expect(result[2].type).toBe(GroupType);
		});

		it('should prioritize workspaceMember lozenge over other lozenges', () => {
			const serverResponse = {
				recommendedUsers: [
					{
						id: 'user-7',
						name: 'Priority User',
						entityType: EntityType.USER,
						avatarUrl: 'https://avatar.url/user7.jpg',
						attributes: {
							workspaceMember: 'true',
							isConfluenceExternalCollaborator: 'true',
						},
					},
				],
				intl: mockIntl,
			};

			const result = transformUsers(serverResponse, mockIntl);

			expect(result[0].lozenge).toBe('MEMBER');
		});

		it('should handle groups with missing name', () => {
			const serverResponse = {
				recommendedUsers: [
					{
						id: 'group-3',
						entityType: EntityType.GROUP,
						avatarUrl: 'https://avatar.url/group3.jpg',
					},
				],
				intl: mockIntl,
			};

			const result = transformUsers(serverResponse, mockIntl);

			expect(result[0].name).toBe('');
		});
	});
});
