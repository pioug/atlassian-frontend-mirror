import { getNumberIdForAvatar } from './index';

describe('getNumberIdForAvatar', () => {
	[
		{
			agentIdentityAccountId: '5b985e7c96cb052b5f65c830',
			agentId: 'cd002f25-46e4-4023-80ff-32e4d90849b4',
			getExpected: () => 0x5f65c830,
		},
		{
			agentIdentityAccountId: '712020:19e57f67-c132-462b-8503-0c19953122cd',
			agentId: 'cd002f25-46e4-4023-80ff-32e4d90849b4',
			getExpected: () => 0x953122cd,
		},
		{
			agentIdentityAccountId: undefined,
			agentId: 'cd002f25-46e4-4023-80ff-32e4d90849b4',
			getExpected: () => 0xd90849b4,
		},
		{
			agentIdentityAccountId: '',
			agentId: 'cd002f25-46e4-4023-80ff-32e4d90849b4',
			getExpected: () => 0xd90849b4,
		},
		{
			agentIdentityAccountId: null,
			agentId: 'cd002f25-46e4-4023-80ff-32e4d90849b4',
			getExpected: () => 0xd90849b4,
		},
	].forEach(({ agentIdentityAccountId, agentId, getExpected }) => {
		it(`should return correctly for agentIdentityAccountId: ${agentIdentityAccountId} and agentId: ${agentId}`, () => {
			expect(getNumberIdForAvatar({ agentIdentityAccountId, agentId })).toBe(getExpected());
		});
	});
});
