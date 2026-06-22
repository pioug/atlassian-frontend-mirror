import { SimpleHasher } from '../../sha256SimpleHasher';
import { ffTest } from '@atlassian/feature-flags-test-utils';

describe('sha256 SimpleHasher', () => {
	const blob = new Blob(['1234567890']);

	it('should hash simple blob', () =>
		new SimpleHasher().hash(blob).then((hash) => {
			expect(hash).toEqual(
				'sha256-c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646',
			);
		}));

	it('should return rejected promise when invalid input is given', () =>
		new SimpleHasher().hash(null as any).then(
			() => {
				throw new Error('Promise was expected to fail');
			},
			(error) => {
				expect(error).not.toBeUndefined();
			},
		));

	describe('when FileReader fails', () => {
		const originalFileReader = (global as any).FileReader;

		afterEach(() => {
			(global as any).FileReader = originalFileReader;
		});

		const mockFailingFileReader = (error: DOMException | null) => {
			class MockFileReader {
				onload: (() => void) | null = null;
				onerror: ((event: unknown) => void) | null = null;
				result: unknown = null;
				error: DOMException | null = error;
				readAsArrayBuffer() {
					setTimeout(() => {
						this.onerror?.({ isTrusted: true, target: this });
					}, 0);
				}
			}
			(global as any).FileReader = MockFileReader as unknown as typeof FileReader;
		};

		ffTest.on('platform_media_filereader_error_surfacing', 'enabled', () => {
			it('rejects with a real Error carrying the DOMException name', () => {
				mockFailingFileReader(new DOMException('cannot read', 'NotReadableError'));
				return expect(new SimpleHasher().hash(blob)).rejects.toMatchObject({
					name: 'NotReadableError',
					message: 'NotReadableError',
				});
			});

			it('falls back to FileReaderError when reader.error is null', () => {
				mockFailingFileReader(null);
				return expect(new SimpleHasher().hash(blob)).rejects.toMatchObject({
					name: 'FileReaderError',
				});
			});
		});

		ffTest.off('platform_media_filereader_error_surfacing', 'disabled', () => {
			it('rejects with the raw event (legacy behaviour)', () => {
				mockFailingFileReader(new DOMException('cannot read', 'NotReadableError'));
				return expect(new SimpleHasher().hash(blob)).rejects.not.toBeInstanceOf(Error);
			});
		});
	});
});
