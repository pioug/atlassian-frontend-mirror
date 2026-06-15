import { getDefaultReactions } from './constants';

describe('constants', () => {
	it('should use legacy default reactions when the teamoji picker refresh experiment is disabled', () => {
		expect(getDefaultReactions(false)).toEqual([
			{ id: '1f44d', shortName: ':thumbsup:' },
			{ id: '1f44f', shortName: ':clap:' },
			{ id: '1f525', shortName: ':fire:' },
			{ id: '2764', shortName: ':heart:' },
			{ id: '1f632', shortName: ':astonished:' },
			{ id: '1f914', shortName: ':thinking:' },
		]);
	});

	it('should use teamoji default reactions when the teamoji picker refresh experiment is enabled', () => {
		expect(getDefaultReactions(true)).toEqual([
			{ id: 'atlassian-thumbs_up', shortName: ':thumbs_up:' },
			{ id: 'atlassian-clap', shortName: ':clap:' },
			{ id: 'atlassian-fire', shortName: ':fire:' },
			{ id: 'atlassian-red_heart', shortName: ':red_heart:' },
			{ id: 'atlassian-surprise', shortName: ':surprise:' },
			{ id: 'atlassian-thinking', shortName: ':thinking:' },
		]);
	});
});
