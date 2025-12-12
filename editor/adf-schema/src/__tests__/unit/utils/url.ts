import { getLinkMatch, isRootRelative, normalizeUrl } from '../../../utils/url';
const packageName = process.env.npm_package_name as string;

describe(`${packageName}/url url utils`, () => {
	describe('normalizeUrl', () => {
		const examples = [
			['prettyandsimple@example.com', 'mailto:prettyandsimple@example.com'],
			['gopher://go.com', 'gopher://go.com'],
			['dynamicsnav://go.com', 'dynamicsnav://go.com'],
			['integrity://go.com', 'integrity://go.com'],
			['file://go.pdf', 'file://go.pdf'],
			['smb://go.com', 'smb://go.com'],
			['mailto:prettyandsimple@example.com', 'mailto:prettyandsimple@example.com'],
			['tel:1234', 'tel:1234'],
			['tel:1234', 'tel:1234'],

			// Examples from https://datatracker.ietf.org/doc/html/rfc3966#section-6
			['tel:+1-201-555-0123', 'tel:+1-201-555-0123'],
			['tel:+1-201-555-0123', 'tel:+1-201-555-0123'],
			['tel:+1(800)555-0123', 'tel:+1(800)555-0123'],

			// adf-schema didn't previously support notes:, even though linking-common does.
			// This isn't a valid scheme, so we're not adding support
			['notes:somenoteurl', ''],
			['notes://somenoteurl', 'notes://somenoteurl'],

			['example.com', 'http://example.com'],
			['http://example.com', 'http://example.com'],
			['', ''],
			[undefined, ''],
			['javascript:alert(1)', ''],
			[
				`https://test.blah.com/something#/search?_filter=(filters:!(),var:(x:!t,value:0),time:(from:now-1h,to:now))&_query=(fields:!(field.name,field.message),filters:!(('$state':(store:appState)),sort:!())`,
				`https://test.blah.com/something#/search?_filter=(filters:!(),var:(x:!t,value:0),time:(from:now-1h,to:now))&_query=(fields:!(field.name,field.message),filters:!(('$state':(store:appState)),sort:!())`,
				'handles links with nested parentheses',
			],
			[
				'jamfselfservice://content?entity=policy&id=551&action=view',
				'jamfselfservice://content?entity=policy&id=551&action=view',
			],
		];
		examples.forEach(([actual, expected, message]) => {
			const testCase = message || `should convert from "${actual}" -> "${expected}"`;
			it(testCase, () => {
				expect(normalizeUrl(actual)).toEqual(expected);
			});
		});
	});

	describe('getLinkMatch', () => {
		const noise = (url: string) => `some text before ${url} and some more text after`;
		it('should match web URLs', () => {
			expect(getLinkMatch('http://localhost:1988')).not.toBe(undefined);
			expect(getLinkMatch('http://www.atlassian.com')).not.toBe(undefined);
			expect(getLinkMatch('http://www.atlassian.com/')).not.toBe(undefined);
			expect(getLinkMatch('https://atlassian.com')).not.toBe(undefined);
			expect(getLinkMatch('https://atlassian.com/')).not.toBe(undefined);
			expect(getLinkMatch('www.atlassian.com')).not.toBe(undefined);
			expect(getLinkMatch('www.atlassian.com/')).not.toBe(undefined);
			expect(getLinkMatch('www.atlassian.com/foo/bar')).not.toBe(undefined);
			expect(getLinkMatch('www.atlassian.com:12313/foo/bar')).not.toBe(undefined);
			expect(getLinkMatch('www.atlassian.com/foo/bar#foo')).not.toBe(undefined);
			expect(getLinkMatch('www.atlassian.com/foo/bar?foo#bar')).not.toBe(undefined);
		});

		it('should match only the link when surrounded with text', () => {
			expect(getLinkMatch(noise('http://localhost:1988'))!.raw).toEqual('http://localhost:1988');
			expect(getLinkMatch(noise('http://www.atlassian.com'))!.raw).toEqual(
				'http://www.atlassian.com',
			);
			expect(getLinkMatch(noise('http://www.atlassian.com/'))!.raw).toEqual(
				'http://www.atlassian.com/',
			);
			expect(getLinkMatch(noise('https://atlassian.com'))!.raw).toEqual('https://atlassian.com');
			expect(getLinkMatch(noise('https://atlassian.com/'))!.raw).toEqual('https://atlassian.com/');
			expect(getLinkMatch(noise('www.atlassian.com'))!.raw).toEqual('www.atlassian.com');
			expect(getLinkMatch(noise('www.atlassian.com/'))!.raw).toEqual('www.atlassian.com/');
			expect(getLinkMatch(noise('www.atlassian.com/foo/bar'))!.raw).toEqual(
				'www.atlassian.com/foo/bar',
			);
			expect(getLinkMatch(noise('www.atlassian.com:12313/foo/bar'))!.raw).toEqual(
				'www.atlassian.com:12313/foo/bar',
			);
			expect(getLinkMatch(noise('www.atlassian.com/foo/bar#foo'))!.raw).toEqual(
				'www.atlassian.com/foo/bar#foo',
			);
			expect(getLinkMatch(noise('www.atlassian.com/foo/bar?foo#bar'))!.raw).toEqual(
				'www.atlassian.com/foo/bar?foo#bar',
			);
		});

		it('should not match filepaths', () => {
			expect(getLinkMatch('./index.php')).toEqual(null);
			expect(getLinkMatch('/index.php')).toEqual(null);
		});
		it('should not match markdown headings', () => {
			expect(getLinkMatch('#hello')).toEqual(null);
			expect(getLinkMatch('# hello')).toEqual(null);
		});
		it('should not match javascript', () => {
			expect(getLinkMatch('javascript:alert(1);')).toEqual(null);
		});
		it('should not match app: or tcp: schemes', () => {
			expect(getLinkMatch('app://atlassian.com')).toEqual(null);
			expect(getLinkMatch('tcp://173.123.21.12')).toEqual(null);
		});

		it('should not match special characters', () => {
			expect(getLinkMatch('[www.atlassian.com?hello=there]')!.raw).toEqual(
				'www.atlassian.com?hello=there',
			);
			expect(getLinkMatch('(www.atlassian.com#hello>')!.raw).toEqual('www.atlassian.com#hello');
			expect(getLinkMatch('(www.atlassian.com/hello<')!.raw).toEqual('www.atlassian.com/hello');
			expect(getLinkMatch('(www.atlassian.com/hello?foo=bar^)')!.raw).toEqual(
				'www.atlassian.com/hello?foo=bar^',
			);
		});
		it('should match EMAILs', () => {
			expect(getLinkMatch('prettyandsimple@example.com')).not.toBe(undefined);
			expect(getLinkMatch('very.common@example.com')).not.toBe(undefined);
			expect(getLinkMatch('disposable.style.email.with+symbol@example.com')).not.toBe(undefined);
			expect(getLinkMatch('other.email-with-dash@example.com')).not.toBe(undefined);
			expect(getLinkMatch('x@example.com')).not.toBe(undefined);
			expect(getLinkMatch('example-indeed@strange-example.com')).not.toBe(undefined);
			expect(getLinkMatch('example@s.solutions')).not.toBe(undefined);
		});

		it('should not match invalid EMAILs', () => {
			expect(getLinkMatch('john.doe@example..com')).toEqual(null);
		});

		it('should match only the EMAIL when surrounded with text', () => {
			expect(getLinkMatch(noise('http://localhost:1988'))!.raw).toEqual('http://localhost:1988');
			expect(getLinkMatch(noise('prettyandsimple@example.com'))!.raw).toEqual(
				'prettyandsimple@example.com',
			);
			expect(getLinkMatch(noise('very.common@example.com'))!.raw).toEqual(
				'very.common@example.com',
			);
			expect(getLinkMatch(noise('disposable.style.email.with+symbol@example.com'))!.raw).toEqual(
				'disposable.style.email.with+symbol@example.com',
			);
			expect(getLinkMatch(noise('other.email-with-dash@example.com'))!.raw).toEqual(
				'other.email-with-dash@example.com',
			);
			expect(getLinkMatch(noise('x@example.com'))!.raw).toEqual('x@example.com');
			expect(getLinkMatch(noise('example-indeed@strange-example.com'))!.raw).toEqual(
				'example-indeed@strange-example.com',
			);
		});

		it('should not match filename extensions', () => {
			expect(getLinkMatch('test.sh')).toEqual(null);
			expect(getLinkMatch('test.as')).toEqual(null);
			expect(getLinkMatch('test.ms')).toEqual(null);
			expect(getLinkMatch('test.py')).toEqual(null);
			expect(getLinkMatch('test.ps')).toEqual(null);
			expect(getLinkMatch('test.so')).toEqual(null);
			expect(getLinkMatch('test.pl')).toEqual(null);
		});
	});

	describe('isRootRelative', () => {
		it('should return true', () => {
			expect(isRootRelative('/test')).toEqual(true);
			expect(isRootRelative('/home/test')).toEqual(true);
			expect(isRootRelative('#top')).toEqual(true);
			expect(isRootRelative('#')).toEqual(true);
		});
		it('should return false', () => {
			expect(isRootRelative('www.atlassian.com')).toEqual(false);
			expect(isRootRelative('https://www.atlassian.com')).toEqual(false);
			expect(isRootRelative('test/')).toEqual(false);
			expect(isRootRelative('  /test')).toEqual(false);
			expect(isRootRelative('#blah')).toEqual(false);
		});
	});
});
