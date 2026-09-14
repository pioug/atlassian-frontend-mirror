import { appendTimestamp } from '../../util/appendTimestamp';

export const getFilesFromClipboard = (files: FileList): File[] => {
	return Array.from(files).map((file) => {
		if (file.type.indexOf('image/') === 0) {
			const name = appendTimestamp(file.name, (file as any).lastModified);
			return new File([file], name, {
				type: file.type,
			});
		} else {
			return file;
		}
	});
};
