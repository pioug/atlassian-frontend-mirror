import { spawn } from 'child_process';
import { type DistTagsType } from '../types';

export type PackageVersionHistoryAndTagsType = {
	time: { [version: string]: string };
	'dist-tags': DistTagsType;
};

export default function getPackageVersionHistoryAndTags(
	packageName: string,
): Promise<PackageVersionHistoryAndTagsType> {
	return new Promise((resolve, reject) => {
		let stdoutData = '';
		const child = spawn(`yarn`, ['info', packageName, '--json']);

		child.stdout.on('data', function (data) {
			stdoutData += data.toString();
		});
		child.stderr.on('data', function (data) {
			console.error(`error: Unable to execute yarn info for ${packageName}`, data);

			reject(data);
		});
		child.on('close', function (code) {
			if (code !== 0) {
				return;
			}

			try {
				const parseData = JSON.parse(stdoutData).data;
				resolve({
					time: parseData['time'],
					'dist-tags': parseData['dist-tags'],
				});
			} catch (error) {
				console.error(`Error parsing json output: ${error}`);
				reject(error);
			}
		});
	});
}
