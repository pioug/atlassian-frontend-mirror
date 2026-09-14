import { main } from '../atlas-cli';
import { run } from '../cli';

jest.mock('../cli', () => ({
	run: jest.fn(),
}));

const mockRun = run as jest.MockedFunction<typeof run>;

describe('Atlas CLI entrypoint', () => {
	const originalExitCode = process.exitCode;

	afterEach(() => {
		process.exitCode = originalExitCode;
		jest.restoreAllMocks();
	});

	it('forwards Atlas arguments and propagates the returned exit code', async () => {
		mockRun.mockResolvedValue(3);

		await main(['search', 'missing', '--json']);

		expect(mockRun).toHaveBeenCalledWith(['search', 'missing', '--json'], undefined, {
			invocation: 'atlas ads',
		});
		expect(process.exitCode).toBe(3);
	});

	it('propagates numeric errors as exit codes', async () => {
		mockRun.mockRejectedValue(2);

		await main(['unknown']);

		expect(process.exitCode).toBe(2);
	});

	it('reports unexpected errors and exits with runtime error', async () => {
		const error = new Error('boom');
		const stderrWrite = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
		mockRun.mockRejectedValue(error);

		await main(['search', 'avatar']);

		expect(stderrWrite).toHaveBeenCalledWith(expect.stringContaining('Error: boom'));
		expect(process.exitCode).toBe(1);
	});
});
