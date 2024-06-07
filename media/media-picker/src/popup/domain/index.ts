// TODO [MS-1255] this interface is almost identical to LocalUploadFileMetadata (and possibly to tens others)
export interface ServiceFile {
	readonly mimeType: string;
	readonly id: string;
	readonly name: string;
	readonly size: number;
	readonly date: number;
	readonly occurrenceKey?: string;
	readonly metadata?: any;
	readonly createdAt?: number;
}

export interface SelectedItem extends ServiceFile {
	readonly serviceName: string;
	readonly accountId?: string;
}
