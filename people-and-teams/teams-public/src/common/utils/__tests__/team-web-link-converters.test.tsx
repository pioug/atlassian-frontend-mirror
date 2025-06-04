import { type NewTeamWebLink, type TeamContainer } from '../../types';
import { isNewTeamWebLink } from '../team-web-link-converters';

describe('team-web-link-converters', () => {
	describe('isNewTeamWebLink', () => {
		it('should return true for NewTeamWebLink object', () => {
			const newWebLink: NewTeamWebLink = {
				contentTitle: 'Google slides',
				description: '',
				linkUri: 'https://docs.google.com/presentation/1',
			};

			const result = isNewTeamWebLink(newWebLink);
			expect(result).toBe(true);
		});

		it('should return false for TeamContainer object', () => {
			const container: TeamContainer = {
				id: 'container-1',
				type: 'JiraProject',
				name: 'Jira Project',
				icon: null,
				link: 'https://example.com/jira',
			};

			const result = isNewTeamWebLink(container);
			expect(result).toBe(false);
		});
	});
});
