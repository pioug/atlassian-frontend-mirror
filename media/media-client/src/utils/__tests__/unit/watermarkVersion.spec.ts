import { getWatermarkVersionFromToken } from '../../watermarkVersion';

function createJwtToken(payload: Record<string, unknown>): string {
	const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
	const body = btoa(JSON.stringify(payload));
	return `${header}.${body}.signature`;
}

describe('getWatermarkVersionFromToken', () => {
	it('should extract watermark version from a valid JWT token', () => {
		const token = createJwtToken({
			iss: '604d2f43-c264-4a11-9ea2-dca8cf131262',
			watermark: JSON.stringify({
				v: 'WjtFdA',
				ari: 'ari:cloud:confluence:a436116f-02ce-4520-8fbb-7301462a1674:space/5279755607',
			}),
		});

		expect(getWatermarkVersionFromToken(token)).toBe('WjtFdA');
	});

	it('should return undefined when token has no watermark field', () => {
		const token = createJwtToken({
			iss: '604d2f43-c264-4a11-9ea2-dca8cf131262',
			exp: 1773104815,
		});

		expect(getWatermarkVersionFromToken(token)).toBeUndefined();
	});

	it('should return undefined when watermark field has no version', () => {
		const token = createJwtToken({
			watermark: JSON.stringify({
				ari: 'ari:cloud:confluence:a436116f-02ce-4520-8fbb-7301462a1674:space/5279755607',
			}),
		});

		expect(getWatermarkVersionFromToken(token)).toBeUndefined();
	});

	it('should return undefined when watermark field is not valid JSON', () => {
		const token = createJwtToken({
			watermark: 'not-json',
		});

		expect(getWatermarkVersionFromToken(token)).toBeUndefined();
	});

	it('should return undefined for a malformed token', () => {
		expect(getWatermarkVersionFromToken('not-a-jwt')).toBeUndefined();
	});

	it('should return undefined for an empty string', () => {
		expect(getWatermarkVersionFromToken('')).toBeUndefined();
	});

	it('should handle base64url encoding with special characters', () => {
		const payload = {
			watermark: JSON.stringify({ v: 'abc+/=' }),
		};
		const header = btoa(JSON.stringify({ alg: 'HS256' }));
		const body = btoa(JSON.stringify(payload))
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=+$/, '');

		const token = `${header}.${body}.signature`;
		expect(getWatermarkVersionFromToken(token)).toBe('abc+/=');
	});
});
