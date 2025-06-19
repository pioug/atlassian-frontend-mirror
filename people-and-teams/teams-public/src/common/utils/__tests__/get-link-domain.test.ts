import { getDomainFromLinkUri } from '../get-link-domain';

describe('getDomainFromLinkUri', () => {
	describe('real-world URL examples', () => {
		it('should extract domain from Atlassian wiki URL', () => {
			const result = getDomainFromLinkUri('https://hello.atlassian.net/wiki/people/team/1');
			expect(result).toBe('hello.atlassian.net');
		});

		it('should extract domain from Google Docs URL', () => {
			const result = getDomainFromLinkUri('https://docs.google.com/presentation/d/2');
			expect(result).toBe('docs.google.com');
		});

		it('should extract domain from Loom URL and strip www', () => {
			const result = getDomainFromLinkUri('https://www.loom.com/share/3');
			expect(result).toBe('loom.com');
		});
	});

	describe('URLs without protocol', () => {
		it('should handle Atlassian URL without protocol', () => {
			const result = getDomainFromLinkUri('hello.atlassian.net/wiki/people/team/1');
			expect(result).toBe('hello.atlassian.net');
		});

		it('should handle Google Docs URL without protocol', () => {
			const result = getDomainFromLinkUri('docs.google.com/presentation/d/2');
			expect(result).toBe('docs.google.com');
		});

		it('should handle www domain without protocol and strip www', () => {
			const result = getDomainFromLinkUri('www.loom.com/share/3');
			expect(result).toBe('loom.com');
		});
	});
});
