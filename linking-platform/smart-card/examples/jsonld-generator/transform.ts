import { type JsonLd } from 'json-ld-types';

type FormLinkData = {
	attachmentCount?: number;
	commentCount?: number;
	description?: string;
	checkedItemProgressCount?: number;
	checkedItemProgressTotalCount?: number;
	createdByImageUrl?: string;
	createdByName?: string;
	downloadUrl?: string;
	dueOn?: string;
	embedAspectRatio?: number;
	embedUrl?: string;
	iconUrl?: string;
	priorityIconUrl?: string;
	priorityName?: string;
	providerIconUrl?: string;
	providerName?: string;
	reactCount?: number;
	readTime?: number;
	statusAppearance?: string;
	statusLabel?: string;
	subscriberCount?: number;
	subTaskProgressCount?: number;
	subTaskProgressTotalCount?: number;
	thumbnailUrl?: string;
	title?: string;
	updatedOn?: string;
	url: string;
	viewCount?: number;
	voteCount?: number;
};

const toNumberOrUndefined = (value?: number) => (value ? Number(value) : undefined);

const toStringOrUndefined = (value?: string) => (value ? value : undefined);

const toIcon = (iconUrl?: string): JsonLd.Primitives.Image | undefined =>
	iconUrl ? { '@type': 'Image', url: iconUrl } : undefined;

const toCheckListProgress = (
	checkedItemProgressCount?: number,
	checkedItemProgressTotalCount?: number,
): JsonLd.Primitives.CheckItemProgress | undefined => {
	const checkedItems = toNumberOrUndefined(checkedItemProgressCount);
	const totalItems = toNumberOrUndefined(checkedItemProgressTotalCount);
	if (checkedItems !== undefined && totalItems !== undefined) {
		return { checkedItems, totalItems };
	}
};

const toCreateBy = (createdByName?: string, createdByImageUrl?: string) => {
	if (!createdByName) {
		return;
	}

	return [
		{
			'@type': 'Person',
			name: createdByName,
			icon: toStringOrUndefined(createdByImageUrl),
		},
	];
};

const toDownloadAction = (downloadUrl?: string) => {
	if (!downloadUrl) {
		return;
	}

	return {
		'atlassian:downloadUrl': toStringOrUndefined(downloadUrl),
		'schema:potentialAction': {
			'@type': 'DownloadAction',
		},
	};
};

const toGenerator = ({
	providerName,
	providerIconUrl,
}: FormLinkData): JsonLd.Primitives.Object | undefined => {
	if (!providerName && !providerIconUrl) {
		return;
	}

	return {
		'@type': 'Object',
		name: providerName,
		icon: toIcon(providerIconUrl),
	};
};

const toPreview = (
	embedUrl?: string,
	aspectRatio?: number,
): JsonLd.Primitives.Object['preview'] => {
	if (aspectRatio) {
		return {
			'@type': 'Link',
			href: embedUrl,
			'atlassian:aspectRatio': aspectRatio,
		};
	}

	return toStringOrUndefined(embedUrl);
};

const toPriority = (
	priorityName?: string,
	priorityIconUrl?: string,
): JsonLd.Primitives.Object | string | undefined => {
	if (!priorityName) {
		return;
	}

	if (!priorityIconUrl) {
		return priorityName;
	}

	return {
		'@type': 'Object',
		name: priorityName,
		icon: toIcon(priorityIconUrl),
	};
};

const toStatus = (type: JsonLd.Primitives.Type, statusLabel?: string, stateAppearance?: string) => {
	if (!statusLabel) {
		return;
	}

	const status = {
		'@type': 'Object',
		name: statusLabel,
		// @ts-ignore appearance doesn't exist in JSON-LD 🙃
		appearance: toStringOrUndefined(stateAppearance),
	};
	if (type === 'atlassian:Task') {
		return { tag: status };
	}

	return { 'atlassian:state': status };
};

const toSubtaskProgress = (
	subTaskProgressCount?: number,
	subTaskProgressTotalCount?: number,
): JsonLd.Primitives.SubTasksProgress | undefined => {
	const resolvedCount = toNumberOrUndefined(subTaskProgressCount);
	const totalCount = toNumberOrUndefined(subTaskProgressTotalCount);
	if (resolvedCount !== undefined && totalCount !== undefined) {
		return { resolvedCount, totalCount };
	}
};

const toType = (data: FormLinkData) => {
	if (data.priorityName || data.subscriberCount || data.subTaskProgressTotalCount) {
		return 'atlassian:Task';
	}

	if (data.statusLabel) {
		return 'schema:DigitalDocument';
	}

	if (
		data.attachmentCount ||
		data.checkedItemProgressTotalCount ||
		data.commentCount ||
		data.reactCount ||
		data.viewCount ||
		data.voteCount
	) {
		return 'Document';
	}

	return 'Object';
};

export const transform = (data: FormLinkData): JsonLd.Response => {
	const type = toType(data);

	return {
		meta: {
			visibility: 'public',
			access: 'granted',
			auth: [],
			definitionId: 'd1',
			key: 'your-object-provider',
		},
		data: {
			'@context': {
				'@vocab': 'https://www.w3.org/ns/activitystreams#',
				atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
				schema: 'http://schema.org/',
			},
			'@type': type,
			attributedTo: toCreateBy(data.createdByName, data.createdByImageUrl),
			endTime: toStringOrUndefined(data.dueOn),
			generator: toGenerator(data),
			icon: toIcon(data.iconUrl),
			image: toStringOrUndefined(data.thumbnailUrl),
			name: toStringOrUndefined(data.title),
			preview: toPreview(data.embedUrl, data.embedAspectRatio),
			summary: toStringOrUndefined(data.description),
			updated: toStringOrUndefined(data.updatedOn),
			url: toStringOrUndefined(data.url),
			...toDownloadAction(data.downloadUrl),

			// Shared: JsonLd.Data.Task & JsonLd.Data.Document
			'atlassian:attachmentCount': toNumberOrUndefined(data.attachmentCount),
			'atlassian:checkItems': toCheckListProgress(
				data.checkedItemProgressCount,
				data.checkedItemProgressTotalCount,
			),
			'atlassian:reactCount': toNumberOrUndefined(data.reactCount),
			'atlassian:viewCount': toNumberOrUndefined(data.viewCount),
			'atlassian:voteCount': toNumberOrUndefined(data.voteCount),
			'schema:commentCount': toNumberOrUndefined(data.commentCount),
			...toStatus(type, data.statusLabel, data.statusAppearance),

			// JsonLd.Data.Document
			'atlassian:readTimeInMinutes': toNumberOrUndefined(data.readTime),

			// atlassian:Task
			'atlassian:priority': toPriority(data.priorityName, data.priorityIconUrl),
			'atlassian:subscriberCount': toNumberOrUndefined(data.subscriberCount),
			'atlassian:subTasks': toSubtaskProgress(
				data.subTaskProgressCount,
				data.subTaskProgressTotalCount,
			),
		},
	} as unknown as JsonLd.Response;
};
