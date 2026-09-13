import { exec } from 'child_process';

// Lock files tend to be huge
const FiveMBBuffer = 1024 * 5000;

export default function getFileHistoryFromGit(fileName: string): Promise<string> {
	return new Promise((resolve, reject) => {
		exec(`git log ${fileName}`, { maxBuffer: FiveMBBuffer }, (error, stdout, stderr) => {
			if (error) {
				reject(error);
			}

			if (stderr) {
				reject(stderr);
			}

			resolve(stdout);
		});
	});
}
