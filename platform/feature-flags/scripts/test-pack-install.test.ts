import { exec, ChildProcess } from 'child_process';
import path from 'path';

const getExitCode = async (
  childProcess: ChildProcess,
): Promise<number | null> =>
  new Promise((resolveFunc) => {
    childProcess.stdout?.on('data', (x) => {
      process.stdout.write(x.toString());
    });
    childProcess.stderr?.on('data', (x) => {
      process.stderr.write(x.toString());
    });
    childProcess.on('exit', (code) => {
      resolveFunc(code);
    });
  });

describe('verify package installation works outside monorepo', () => {
  it('should install without errors', async () => {
    const exitCode = await getExitCode(
      exec('sh ./scripts/test-pack-install.sh', {
        cwd: path.join(process.cwd(), 'packages/platform/feature-flags'),
      }),
    );

    expect(exitCode).toBe(0);
  });
});
