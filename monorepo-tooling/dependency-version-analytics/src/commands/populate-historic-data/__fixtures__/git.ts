import type { DefaultLogFields, LogResult } from 'simple-git';

export const generateLogsWithFiles = (list: { hash: string; files: string[] }[]): LogResult => {
	const rawLogs: DefaultLogFields[] = list.map(({ hash, files }) => ({
		hash,
		date: '2020-11-26 00:00:00 +0000',
		message: `Message for hash "${hash}"`,
		author_name: 'Foo',
		author_email: 'foo@atlassian.com',
		refs: 'abc',
		body: '',
		diff: {
			files: files.map((fileName) => ({
				file: fileName,
				after: 0,
				before: 0,
				binary: false,
			})),
			changed: 0,
			insertions: 0,
			deletions: 0,
		},
	}));

	return {
		all: rawLogs,
		total: rawLogs.length,
		latest: rawLogs[rawLogs.length - 1],
	};
};

export const generateLogs = (...hashList: string[]): LogResult => {
	return generateLogsWithFiles(hashList.map((hash) => ({ hash, files: ['package.json'] })));
};
