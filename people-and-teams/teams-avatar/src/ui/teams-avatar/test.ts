import { ffTest } from '@atlassian/feature-flags-test-utils';

import { isSquareIcon } from './utils';

describe('isSquareIcon', () => {
	it('should return false if src is not provided', () => {
		expect(isSquareIcon()).toBe(false);
	});

	it('should return false if src is not a square icon URL', () => {
		expect(isSquareIcon('https://example.com')).toBe(false);
	});

	it('should return false if src is not a matching url', () => {
		expect(
			isSquareIcon(
				'https://api.media.atlassian.com/file/7611f88d-a951-49ae-aac4-8ed80f10af9f/image?allowAnimated=false&width=1500&height=1500&mode=fit&upscale=false',
			),
		).toBe(false);
		expect(isSquareIcon('not-a-url')).toBe(false);

		expect(
			isSquareIcon(
				'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/teams/avatars/v3/blue.svg',
			),
		).toBe(false);
		expect(
			isSquareIcon(
				'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/teams/avatars/6.svg',
			),
		).toBe(false);
	});
	ffTest.on('enable-team-avatar-switch', 'enable-team-avatar-switch', () => {
		it('should return true if src is a square icon URL', () => {
			expect(
				isSquareIcon(
					'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/teams/avatars/v4/blue_4.svg',
				),
			).toBe(true);
			expect(
				isSquareIcon(
					'https://teams-directory-frontend.stg-east.frontend.public.atl-paas.net/assets/teams/avatars/v4/blue_1.svg',
				),
			).toBe(true);
		});
	});

	ffTest.off('enable-team-avatar-switch', 'enable-team-avatar-switch', () => {
		it('should return true if src is a square icon URL', () => {
			expect(
				isSquareIcon(
					'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/teams/avatars/v4/blue_4.svg',
				),
			).toBe(false);
			expect(
				isSquareIcon(
					'https://teams-directory-frontend.stg-east.frontend.public.atl-paas.net/assets/teams/avatars/v4/blue_1.svg',
				),
			).toBe(false);
		});
	});
});
