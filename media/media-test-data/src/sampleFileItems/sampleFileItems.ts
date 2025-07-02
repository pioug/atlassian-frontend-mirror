import { RECENTS_COLLECTION, type ResponseFileItem } from '@atlaskit/media-client';
import {
	assign,
	copy,
	getIdentifier,
	type PartialResponseFileItem,
} from '@atlaskit/media-client/test-helpers';

import { type FileItemGenerator } from './types';

const createGenerator =
	(baseFileItem: ResponseFileItem): FileItemGenerator =>
	(overrideFileItem?: PartialResponseFileItem) => {
		const fileItem = assign(copy(baseFileItem), overrideFileItem); // First create a new Id (copy), then add the override attributes (assign)
		const identifier = getIdentifier(fileItem);
		return [fileItem, identifier];
	};

const workingImgWithRemotePreview = createGenerator({
	type: 'file',
	id: '020c195b-a2ad-49b7-9b18-f13ef014bf75',
	collection: 'MediaServicesSample',
	details: {
		mediaType: 'image',
		mimeType: 'image/png',
		name: 'img.png',
		size: 41811,
		processingStatus: 'succeeded',
		artifacts: {
			'image.jpg': {
				url: '/file/020c195b-a2ad-49b7-9b18-f13ef014bf75/artifact/image.jpg/binary',
				processingStatus: 'succeeded',
			},
			'image.png': {
				url: '/file/020c195b-a2ad-49b7-9b18-f13ef014bf75/artifact/image.png/binary',
				processingStatus: 'succeeded',
			},
		},
		representations: {
			image: {},
		},
		createdAt: 1693368330362,
	},
});

const abuseImage = createGenerator({
	type: 'file',
	id: '020c195b-a2ad-49b7-9b18-f13ef014bf75',
	collection: 'MediaServicesSample',
	details: {
		mediaType: 'image',
		mimeType: 'image/png',
		name: 'abuse-img.png',
		size: 104567,
		processingStatus: 'succeeded',
		artifacts: {
			'image.jpg': {
				url: '/file/020c195b-a2ad-49b7-9b18-f13ef014bf75/artifact/image.jpg/binary',
				processingStatus: 'succeeded',
			},
			'image.png': {
				url: '/file/020c195b-a2ad-49b7-9b18-f13ef014bf75/artifact/image.png/binary',
				processingStatus: 'succeeded',
			},
		},
		representations: {
			image: {},
		},
		createdAt: 1693368330362,
		abuseClassification: { classification: 'ABHORRENT', confidence: 'HIGH' },
	},
});

const workingImgWithRemotePreviewInRecentsCollection = createGenerator({
	type: 'file',
	id: '89a0d87e-bb0d-4d86-871a-9ae1ee434ae8',
	collection: RECENTS_COLLECTION,
	details: {
		mediaType: 'image',
		mimeType: 'image/png',
		name: 'img.png',
		size: 41811,
		processingStatus: 'succeeded',
		artifacts: {
			'image.jpg': {
				url: '/file/89a0d87e-bb0d-4d86-871a-9ae1ee434ae8/artifact/image.jpg/binary',
				processingStatus: 'succeeded',
			},
			'image.png': {
				url: '/file/89a0d87e-bb0d-4d86-871a-9ae1ee434ae8/artifact/image.png/binary',
				processingStatus: 'succeeded',
			},
		},
		representations: {
			image: {},
		},
		createdAt: 1693368840422,
	},
});

const processingPdf = createGenerator({
	type: 'file',
	id: '13975a0d-972e-4d80-9f98-c62cb60ae380',
	collection: 'MediaServicesSample',
	details: {
		mediaType: 'doc',
		mimeType: 'application/pdf',
		name: 'Ppdf.pdf',
		size: 41811,
		processingStatus: 'pending',
		artifacts: {},
		representations: {},
		createdAt: 1692853901211,
	},
});

const failedPdf = createGenerator({
	type: 'file',
	id: 'e8c64fb9-a94c-48dc-bad8-088424a56165',
	collection: 'MediaServicesSample',
	details: {
		mediaType: 'doc',
		mimeType: 'application/pdf',
		name: 'fPDF.pdf',
		size: 2975434,
		processingStatus: 'failed',
		artifacts: {},
		representations: {},
		createdAt: 1691113227581,
	},
});

const failedDoc = createGenerator({
	type: 'file',
	id: 'a4be1698-1608-4326-bb5f-c3365cabf2d4',
	collection: 'MediaServicesSample',
	details: {
		mediaType: 'doc',
		mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		name: 'test-doc.xlsx',
		size: 30713,
		processingStatus: 'failed',
		artifacts: {},
		representations: {},
		createdAt: 1691113227581,
	},
});

const passwordPdf = createGenerator({
	type: 'file',
	id: '7e5e5f68-a207-4b5b-a1a6-2ccb4bfe8bb5',
	collection: 'MediaServicesSample',
	details: {
		mediaType: 'doc',
		mimeType: 'application/pdf',
		name: 'password protected.pdf',
		size: 710485,
		processingStatus: 'failed',
		artifacts: {
			'document.pdf': {
				url: '/file/7e5e5f68-a207-4b5b-a1a6-2ccb4bfe8bb5/artifact/document.pdf/binary',
				processingStatus: 'failed',
			},
		},
		representations: {},
		createdAt: 1709516133404,
	},
});

const workingPdfWithRemotePreview = createGenerator({
	type: 'file',
	id: '4e72fab3-bc1d-4ab1-b0fd-8c3b9b3df73f',
	collection: 'MediaServicesSample',
	details: {
		mediaType: 'doc',
		mimeType: 'application/pdf',
		name: 'name.pdf',
		size: 2975434,
		processingStatus: 'succeeded',
		artifacts: {
			'document.pdf': {
				url: '/file/4e72fab3-bc1d-4ab1-b0fd-8c3b9b3df73f/artifact/document.pdf/binary',
				processingStatus: 'succeeded',
			},
			'document.txt': {
				url: '/file/4e72fab3-bc1d-4ab1-b0fd-8c3b9b3df73f/artifact/document.txt/binary',
				processingStatus: 'succeeded',
			},
			'thumb_120.jpg': {
				url: '/file/4e72fab3-bc1d-4ab1-b0fd-8c3b9b3df73f/artifact/thumb_120.jpg/binary',
				processingStatus: 'succeeded',
			},
			'thumb.jpg': {
				url: '/file/4e72fab3-bc1d-4ab1-b0fd-8c3b9b3df73f/artifact/thumb_120.jpg/binary',
				processingStatus: 'succeeded',
			},
			'thumb_320.jpg': {
				url: '/file/4e72fab3-bc1d-4ab1-b0fd-8c3b9b3df73f/artifact/thumb_320.jpg/binary',
				processingStatus: 'succeeded',
			},
			'thumb_large.jpg': {
				url: '/file/4e72fab3-bc1d-4ab1-b0fd-8c3b9b3df73f/artifact/thumb_320.jpg/binary',
				processingStatus: 'succeeded',
			},
		},
		representations: {
			image: {},
		},
		createdAt: 1691113227581, // '04 Aug 2023, 01:40 AM' UTC
	},
});

const pdfNoPreviewItem: ResponseFileItem = {
	type: 'file',
	id: '5daedbe2-9394-4c13-bcb8-2b041bbdd338',
	collection: 'MediaServicesSample',
	details: {
		mediaType: 'doc',
		mimeType: 'application/pdf',
		name: 'name.pdf',
		size: 2975434,
		processingStatus: 'succeeded',
		artifacts: {
			'document.pdf': {
				url: '/file/5daedbe2-9394-4c13-bcb8-2b041bbdd338/artifact/document.pdf/binary',
				processingStatus: 'succeeded',
			},
			'document.txt': {
				url: '/file/5daedbe2-9394-4c13-bcb8-2b041bbdd338/artifact/document.txt/binary',
				processingStatus: 'succeeded',
			},
			'thumb_120.jpg': {
				url: '/file/5daedbe2-9394-4c13-bcb8-2b041bbdd338/artifact/thumb_120.jpg/binary',
				processingStatus: 'succeeded',
			},
			'thumb.jpg': {
				url: '/file/5daedbe2-9394-4c13-bcb8-2b041bbdd338/artifact/thumb_120.jpg/binary',
				processingStatus: 'succeeded',
			},
			'thumb_320.jpg': {
				url: '/file/5daedbe2-9394-4c13-bcb8-2b041bbdd338/artifact/thumb_320.jpg/binary',
				processingStatus: 'succeeded',
			},
			'thumb_large.jpg': {
				url: '/file/5daedbe2-9394-4c13-bcb8-2b041bbdd338/artifact/thumb_320.jpg/binary',
				processingStatus: 'succeeded',
			},
		},
		representations: {},
		createdAt: 1691113227581, // '04 Aug 2023, 01:40 AM' UTC
	},
};
const workingPdfWithoutRemotePreview = createGenerator(pdfNoPreviewItem);

const abusePdfNoPreview = createGenerator({
	...pdfNoPreviewItem,
	details: {
		...pdfNoPreviewItem.details,
		name: 'document-without-preview.pdf',
		abuseClassification: { classification: 'COPYRIGHT', confidence: 'MEDIUM' },
	},
});

const workingPdfWithLocalPreview = createGenerator({
	type: 'file',
	id: 'e766b56f-e1b6-4d25-94f5-21253d469639',
	collection: 'MediaServicesSample',
	details: {
		mediaType: 'doc',
		mimeType: 'application/pdf',
		name: 'name.pdf',
		size: 2975434,
		processingStatus: 'succeeded',
		artifacts: {
			'document.pdf': {
				url: '/file/e766b56f-e1b6-4d25-94f5-21253d469639/artifact/document.pdf/binary',
				processingStatus: 'succeeded',
			},
			'document.txt': {
				url: '/file/e766b56f-e1b6-4d25-94f5-21253d469639/artifact/document.txt/binary',
				processingStatus: 'succeeded',
			},
			'thumb_120.jpg': {
				url: '/file/e766b56f-e1b6-4d25-94f5-21253d469639/artifact/thumb_120.jpg/binary',
				processingStatus: 'succeeded',
			},
			'thumb.jpg': {
				url: '/file/e766b56f-e1b6-4d25-94f5-21253d469639/artifact/thumb_120.jpg/binary',
				processingStatus: 'succeeded',
			},
			'thumb_320.jpg': {
				url: '/file/e766b56f-e1b6-4d25-94f5-21253d469639/artifact/thumb_320.jpg/binary',
				processingStatus: 'succeeded',
			},
			'thumb_large.jpg': {
				url: '/file/e766b56f-e1b6-4d25-94f5-21253d469639/artifact/thumb_320.jpg/binary',
				processingStatus: 'succeeded',
			},
		},
		representations: {},
		createdAt: 1691113227581, // '04 Aug 2023, 01:40 AM' UTC
	},
});

const workingExcelWithLocalPreview = createGenerator({
	type: 'file',
	id: 'e776b56f-e1b6-4d25-94f5-21253d469677',
	collection: 'MediaServicesSample',
	details: {
		mediaType: 'doc',
		mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		name: 'test-doc.xlsx',
		size: 2975434,
		processingStatus: 'succeeded',
		artifacts: {
			'document.pdf': {
				url: '/file/e776b56f-e1b6-4d25-94f5-21253d469677/artifact/document.pdf/binary',
				processingStatus: 'succeeded',
			},
			'document.txt': {
				url: '/file/e776b56f-e1b6-4d25-94f5-21253d469677/artifact/document.txt/binary',
				processingStatus: 'succeeded',
			},
			'thumb_120.jpg': {
				url: '/file/e776b56f-e1b6-4d25-94f5-21253d469677/artifact/thumb_120.jpg/binary',
				processingStatus: 'succeeded',
			},
			'thumb.jpg': {
				url: '/file/e776b56f-e1b6-4d25-94f5-21253d469677/artifact/thumb_120.jpg/binary',
				processingStatus: 'succeeded',
			},
			'thumb_320.jpg': {
				url: '/file/e776b56f-e1b6-4d25-94f5-21253d469677/artifact/thumb_320.jpg/binary',
				processingStatus: 'succeeded',
			},
			'thumb_large.jpg': {
				url: '/file/e776b56f-e1b6-4d25-94f5-21253d469677/artifact/thumb_320.jpg/binary',
				processingStatus: 'succeeded',
			},
		},
		representations: {},
		createdAt: 1691113227581, // '04 Aug 2023, 01:40 AM' UTC
	},
});

const workingVideo = createGenerator({
	type: 'file',
	id: '1b01a476-83b4-4f44-8192-f83b2d00913a',
	collection: 'MediaServicesSample',
	details: {
		mediaType: 'video',
		mimeType: 'video/mp4',
		name: 'VID.mp4',
		size: 12551537,
		processingStatus: 'succeeded',
		artifacts: {
			'poster_1280.jpg': {
				url: '/file/1b01a476-83b4-4f44-8192-f83b2d00913a/artifact/poster_1280.jpg/binary',
				processingStatus: 'succeeded',
			},
			'poster_hd.jpg': {
				url: '/file/1b01a476-83b4-4f44-8192-f83b2d00913a/artifact/poster_1280.jpg/binary',
				processingStatus: 'succeeded',
			},
			'poster_640.jpg': {
				url: '/file/1b01a476-83b4-4f44-8192-f83b2d00913a/artifact/poster_640.jpg/binary',
				processingStatus: 'succeeded',
			},
			'poster.jpg': {
				url: '/file/1b01a476-83b4-4f44-8192-f83b2d00913a/artifact/poster_640.jpg/binary',
				processingStatus: 'succeeded',
			},
			'thumb_120.jpg': {
				url: '/file/1b01a476-83b4-4f44-8192-f83b2d00913a/artifact/thumb_120.jpg/binary',
				processingStatus: 'succeeded',
			},
			'thumb.jpg': {
				url: '/file/1b01a476-83b4-4f44-8192-f83b2d00913a/artifact/thumb_120.jpg/binary',
				processingStatus: 'succeeded',
			},
			'thumb_320.jpg': {
				url: '/file/1b01a476-83b4-4f44-8192-f83b2d00913a/artifact/thumb_320.jpg/binary',
				processingStatus: 'succeeded',
			},
			'thumb_large.jpg': {
				url: '/file/1b01a476-83b4-4f44-8192-f83b2d00913a/artifact/thumb_320.jpg/binary',
				processingStatus: 'succeeded',
			},
			'video_1280.mp4': {
				url: '/file/1b01a476-83b4-4f44-8192-f83b2d00913a/artifact/video_1280.mp4/binary',
				processingStatus: 'succeeded',
			},
			'video_hd.mp4': {
				url: '/file/1b01a476-83b4-4f44-8192-f83b2d00913a/artifact/video_1280.mp4/binary',
				processingStatus: 'succeeded',
			},
			'video_640.mp4': {
				url: '/file/1b01a476-83b4-4f44-8192-f83b2d00913a/artifact/video_640.mp4/binary',
				processingStatus: 'succeeded',
			},
			'video.mp4': {
				url: '/file/1b01a476-83b4-4f44-8192-f83b2d00913a/artifact/video_640.mp4/binary',
				processingStatus: 'succeeded',
			},
		},
		representations: {
			image: {},
		},
		createdAt: 1476337907222,
	},
});

const workingJpegWithRemotePreview = createGenerator({
	type: 'file',
	id: '2dfcc12d-04d7-46e7-9fdf-3715ff00ba40',
	collection: 'MediaServicesSample',
	details: {
		mediaType: 'image',
		mimeType: 'image/jpeg',
		name: 'bigben.jpg',
		size: 10983791,
		processingStatus: 'succeeded',
		artifacts: {
			'image.jpg': {
				url: '/file/2dfcc12d-04d7-46e7-9fdf-3715ff00ba40/artifact/image.jpg/binary',
				processingStatus: 'succeeded',
			},
		},
		representations: {
			image: {},
		},
		createdAt: 1484110138152,
	},
});

const failedVideo = createGenerator({
	type: 'file',
	id: 'e558199f-f982-4d23-93eb-313be5998d1b',
	collection: 'MediaServicesSample',
	details: {
		mediaType: 'video',
		mimeType: 'video/mp4',
		name: 'fail_vid.mp4',
		size: 471770085,
		processingStatus: 'failed',
		artifacts: {},
		representations: {},
		createdAt: 1527753388321,
	},
});

const abuseFailedVideo = createGenerator({
	type: 'file',
	id: 'e558199f-f982-4d23-93eb-313be5998d1b',
	collection: 'MediaServicesSample',
	details: {
		mediaType: 'video',
		mimeType: 'video/mp4',
		name: 'fail_vid.mp4',
		size: 471770085,
		processingStatus: 'failed',
		artifacts: {},
		representations: {},
		createdAt: 1527753388321,
		abuseClassification: { classification: 'ILLICIT', confidence: 'MEDIUM' },
	},
});

const workingAudioWithoutRemotePreview = createGenerator({
	type: 'file',
	id: 'a965c8df-1d64-4db8-9de5-16dfa8fd2e12',
	collection: 'MediaServicesSample',
	details: {
		mediaType: 'audio',
		mimeType: 'audio/mpeg',
		name: 'Audio.mp3',
		size: 5858665,
		processingStatus: 'succeeded',
		artifacts: {
			'audio.mp3': {
				url: '/file/a965c8df-1d64-4db8-9de5-16dfa8fd2e12/artifact/audio.mp3/binary',
				processingStatus: 'succeeded',
			},
			'poster_640.jpg': {
				url: '/file/a965c8df-1d64-4db8-9de5-16dfa8fd2e12/artifact/poster_640.jpg/binary',
				processingStatus: 'succeeded',
			},
			'poster.jpg': {
				url: '/file/a965c8df-1d64-4db8-9de5-16dfa8fd2e12/artifact/poster_640.jpg/binary',
				processingStatus: 'succeeded',
			},
			'thumb_120.jpg': {
				url: '/file/a965c8df-1d64-4db8-9de5-16dfa8fd2e12/artifact/thumb_120.jpg/binary',
				processingStatus: 'succeeded',
			},
			'thumb.jpg': {
				url: '/file/a965c8df-1d64-4db8-9de5-16dfa8fd2e12/artifact/thumb_120.jpg/binary',
				processingStatus: 'succeeded',
			},
			'thumb_320.jpg': {
				url: '/file/a965c8df-1d64-4db8-9de5-16dfa8fd2e12/artifact/thumb_320.jpg/binary',
				processingStatus: 'succeeded',
			},
			'thumb_large.jpg': {
				url: '/file/a965c8df-1d64-4db8-9de5-16dfa8fd2e12/artifact/thumb_320.jpg/binary',
				processingStatus: 'succeeded',
			},
		},
		representations: {},
		createdAt: 1492579752506,
	},
});

const workingArchive = createGenerator({
	type: 'file',
	id: '1abbae6b-f507-4b4f-b181-21016bf3b7cc',
	collection: 'MediaServicesSample',
	details: {
		mediaType: 'archive',
		mimeType: 'application/zip',
		name: 'zip.zip',
		size: 541,
		processingStatus: 'succeeded',
		artifacts: {},
		representations: {},
		createdAt: 1528113888535,
	},
});

const workingUnknown = createGenerator({
	type: 'file',
	id: '7a5698bb-919c-4200-8699-6041e7913b11',
	collection: 'MediaServicesSample',
	details: {
		mediaType: 'unknown',
		mimeType: 'audio/mpeg',
		name: 'unknown.mp3',
		size: 9803369,
		processingStatus: 'succeeded',
		artifacts: {
			'audio.mp3': {
				url: '/file/7a5698bb-919c-4200-8699-6041e7913b11/artifact/audio.mp3/binary',
				processingStatus: 'succeeded',
			},
		},
		representations: {},
		createdAt: 1526550567329,
	},
});

const workingGif = createGenerator({
	type: 'file',
	id: '26adc5af-3af4-42a8-9c24-62b6ce0f9369',
	collection: 'MediaServicesSample',
	details: {
		mediaType: 'image',
		mimeType: 'image/gif',
		name: 'gif.gif',
		size: 8436294,
		processingStatus: 'succeeded',
		artifacts: {
			'image.gif': {
				url: '/file/26adc5af-3af4-42a8-9c24-62b6ce0f9369/artifact/image.gif/binary',
				processingStatus: 'succeeded',
			},
			'image.jpg': {
				url: '/file/26adc5af-3af4-42a8-9c24-62b6ce0f9369/artifact/image.jpg/binary',
				processingStatus: 'succeeded',
			},
		},
		representations: {
			image: {},
		},
		createdAt: 1532050930498,
	},
});

const workingCode = createGenerator({
	type: 'file',
	id: 'd748a73c-a9dd-4d00-9bbb-08b7d1fcee18',
	collection: 'MediaServicesSample',
	details: {
		mediaType: 'doc',
		mimeType: 'text/plain',
		name: 'repo-stats.config.js',
		size: 2441,
		processingStatus: 'succeeded',
		artifacts: {
			'document.pdf': {
				url: '/file/d748a73c-a9dd-4d00-9bbb-08b7d1fcee18/document.pdf/binary',
				processingStatus: 'succeeded',
			},
			'document.txt': {
				url: '/file/d748a73c-a9dd-4d00-9bbb-08b7d1fcee18/document.txt/binary',
				processingStatus: 'succeeded',
			},
			'thumb_120.jpg': {
				url: '/file/d748a73c-a9dd-4d00-9bbb-08b7d1fcee18/thumb_120.jpg/binary',
				processingStatus: 'succeeded',
			},
			'thumb_320.jpg': {
				url: '/file/d748a73c-a9dd-4d00-9bbb-08b7d1fcee18/thumb_320.jpg/binary',
				processingStatus: 'succeeded',
			},
		},
		representations: {
			image: {},
		},
		createdAt: 1712217487207,
	},
});

// This is to simulate MAX_FILE_SIZE_SUPPORTED_BY_CODEVIEWER error

const workingCodeLarge = createGenerator({
	type: 'file',
	id: 'd748a73c-a9dd-4d00-9bbb-08b7d1fcee18',
	collection: 'MediaServicesSample',
	details: {
		mediaType: 'doc',
		mimeType: 'text/plain',
		name: 'repo-stats.config.js',
		size: 10485765,
		processingStatus: 'succeeded',
		artifacts: {
			'document.pdf': {
				url: '/file/d748a73c-a9dd-4d00-9bbb-08b7d1fcee18/document.pdf/binary',
				processingStatus: 'succeeded',
			},
			'document.txt': {
				url: '/file/d748a73c-a9dd-4d00-9bbb-08b7d1fcee18/document.txt/binary',
				processingStatus: 'succeeded',
			},
			'thumb_120.jpg': {
				url: '/file/d748a73c-a9dd-4d00-9bbb-08b7d1fcee18/thumb_120.jpg/binary',
				processingStatus: 'succeeded',
			},
			'thumb_320.jpg': {
				url: '/file/d748a73c-a9dd-4d00-9bbb-08b7d1fcee18/thumb_320.jpg/binary',
				processingStatus: 'succeeded',
			},
		},
		representations: {
			image: {},
		},
		createdAt: 1712217487207,
	},
});

const svg = createGenerator({
	type: 'file',
	id: 'd4fb1cef-d845-42d4-beca-7b185966f4d6',
	collection: 'MediaServicesSample',
	details: {
		mediaType: 'image',
		mimeType: 'image/svg+xml',
		name: 'car.svg',
		size: 527014,
		processingStatus: 'succeeded',
		artifacts: {
			'image.jpg': {
				url: '/file/d4fb1cef-d845-42d4-beca-7b185966f4d6/artifact/image.jpg/binary',
				processingStatus: 'succeeded',
			},
			'image.webp': {
				url: '/file/d4fb1cef-d845-42d4-beca-7b185966f4d6/artifact/image.webp/binary',

				processingStatus: 'succeeded',
			},
		},
		representations: {
			image: {},
		},

		createdAt: 1708310473485,
	},
});

const abuseSvg = createGenerator({
	type: 'file',
	id: 'd4fb1cef-d845-42d4-beca-7b185966f4d6',
	collection: 'MediaServicesSample',
	details: {
		mediaType: 'image',
		mimeType: 'image/svg+xml',
		name: 'car.svg',
		size: 527014,
		processingStatus: 'succeeded',
		artifacts: {
			'image.jpg': {
				url: '/file/d4fb1cef-d845-42d4-beca-7b185966f4d6/artifact/image.jpg/binary',
				processingStatus: 'succeeded',
			},
			'image.webp': {
				url: '/file/d4fb1cef-d845-42d4-beca-7b185966f4d6/artifact/image.webp/binary',

				processingStatus: 'succeeded',
			},
		},
		representations: {
			image: {},
		},

		createdAt: 1708310473485,
		abuseClassification: { classification: 'MALICIOUS', confidence: 'MEDIUM' },
	},
});

const svgWithoutPreview = createGenerator({
	type: 'file',
	id: 'd4fb1cef-d845-42d4-beca-7b185966f4d6',
	collection: 'MediaServicesSample',
	details: {
		mediaType: 'image',
		mimeType: 'image/svg+xml',
		name: 'car.svg',
		size: 527014,
		processingStatus: 'succeeded',
		artifacts: {
			'image.jpg': {
				url: '/file/d4fb1cef-d845-42d4-beca-7b185966f4d6/artifact/image.jpg/binary',
				processingStatus: 'succeeded',
			},
			'image.webp': {
				url: '/file/d4fb1cef-d845-42d4-beca-7b185966f4d6/artifact/image.webp/binary',

				processingStatus: 'succeeded',
			},
		},
		representations: {},

		createdAt: 1708310473485,
	},
});

const svgFailedProcessing = createGenerator({
	type: 'file',
	id: 'd4fb1cef-d845-42d4-beca-7b185966f4d6',
	collection: 'MediaServicesSample',
	details: {
		mediaType: 'image',
		mimeType: 'image/svg+xml',
		name: 'car.svg',
		size: 527014,
		processingStatus: 'failed',
		artifacts: {},
		representations: {},
		createdAt: 1708310473485,
	},
});

const spreadsheet = createGenerator({
	type: 'file',
	id: '51eef4b2-5368-4338-8ac5-159df2ebdb4b',
	collection: 'contentId-4663819632',
	details: {
		mediaType: 'doc',
		mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		name: 'Financial Sample.xlsx',
		size: 83418,
		processingStatus: 'succeeded',
		artifacts: {
			'document.pdf': {
				url: '/file/51eef4b2-5368-4338-8ac5-159df2ebdb4b/artifact/document.pdf/binary',
				processingStatus: 'succeeded',
				size: 414145,
				mimeType: 'application/pdf',
				cdnUrl:
					'https://media-cdn.atlassian.com/us-west-1/v1/cdn/file/51eef4b2-5368-4338-8ac5-159df2ebdb4b/artifact/document.pdf/binary?token=some-test-token',
			},
			'document.txt': {
				url: '/file/51eef4b2-5368-4338-8ac5-159df2ebdb4b/artifact/document.txt/binary',
				processingStatus: 'succeeded',
				size: 97517,
				mimeType: 'text/plain',
			},
			'document.html': {
				url: '/file/51eef4b2-5368-4338-8ac5-159df2ebdb4b/artifact/document.html/binary',
				processingStatus: 'succeeded',
				size: 3794642,
				mimeType: 'text/html',
			},
			'thumb_320.jpg': {
				url: '/file/51eef4b2-5368-4338-8ac5-159df2ebdb4b/artifact/thumb_320.jpg/binary',
				processingStatus: 'succeeded',
				size: 31162,
				mimeType: 'image/jpeg',
			},
			'thumb_large.jpg': {
				url: '/file/51eef4b2-5368-4338-8ac5-159df2ebdb4b/artifact/thumb_320.jpg/binary',
				processingStatus: 'succeeded',
				size: 31162,
				mimeType: 'image/jpeg',
			},
			'thumb_120.jpg': {
				url: '/file/51eef4b2-5368-4338-8ac5-159df2ebdb4b/artifact/thumb_120.jpg/binary',
				processingStatus: 'succeeded',
				size: 4229,
				mimeType: 'image/jpeg',
				cdnUrl:
					'https://media-cdn.atlassian.com/us-west-1/v1/cdn/file/51eef4b2-5368-4338-8ac5-159df2ebdb4b/artifact/thumb_120.jpg/binary?token=some-test-token',
			},
			'thumb.jpg': {
				url: '/file/51eef4b2-5368-4338-8ac5-159df2ebdb4b/artifact/thumb_120.jpg/binary',
				processingStatus: 'succeeded',
				size: 4229,
				mimeType: 'image/jpeg',
			},
		},
		representations: {
			image: {},
		},
		createdAt: 1736498327114,
	},
});

const csv = createGenerator({
	type: 'file',
	id: '4e2459a5-a444-4752-a401-2f1187750d43',
	collection: 'contentId-4663819632',
	details: {
		mediaType: 'doc',
		mimeType: 'text/plain',
		name: 'industry.csv',
		size: 749,
		processingStatus: 'succeeded',
		artifacts: {
			'document.pdf': {
				url: '/file/4e2459a5-a444-4752-a401-2f1187750d43/artifact/document.pdf/binary',
				processingStatus: 'succeeded',
				size: 14631,
				mimeType: 'application/pdf',
				cdnUrl:
					'https://media-cdn.atlassian.com/us-west-1/v1/cdn/file/4e2459a5-a444-4752-a401-2f1187750d43/artifact/document.pdf/binary?token=some-test-token',
			},
			'document.txt': {
				url: '/file/4e2459a5-a444-4752-a401-2f1187750d43/artifact/document.txt/binary',
				processingStatus: 'succeeded',
				size: 750,
				mimeType: 'text/plain',
			},
			'thumb_320.jpg': {
				url: '/file/4e2459a5-a444-4752-a401-2f1187750d43/artifact/thumb_320.jpg/binary',
				processingStatus: 'succeeded',
				size: 10606,
				mimeType: 'image/jpeg',
			},
			'thumb_large.jpg': {
				url: '/file/4e2459a5-a444-4752-a401-2f1187750d43/artifact/thumb_320.jpg/binary',
				processingStatus: 'succeeded',
				size: 10606,
				mimeType: 'image/jpeg',
			},
			'thumb_120.jpg': {
				url: '/file/4e2459a5-a444-4752-a401-2f1187750d43/artifact/thumb_120.jpg/binary',
				processingStatus: 'succeeded',
				size: 1558,
				mimeType: 'image/jpeg',
				cdnUrl:
					'https://media-cdn.atlassian.com/us-west-1/v1/cdn/file/4e2459a5-a444-4752-a401-2f1187750d43/artifact/thumb_120.jpg/binary?token=some-test-token',
			},
			'thumb.jpg': {
				url: '/file/4e2459a5-a444-4752-a401-2f1187750d43/artifact/thumb_120.jpg/binary',
				processingStatus: 'succeeded',
				size: 1558,
				mimeType: 'image/jpeg',
			},
		},
		representations: {
			image: {},
		},
		createdAt: 1736497369867,
	},
});

const videoCaptions = createGenerator({
	type: 'file',
	id: '6643202c-6d5d-428a-9db1-69f98164f0f6',
	collection: 'MediaServicesSample',
	details: {
		mediaType: 'video',
		mimeType: 'video/mp4',
		name: 'sagan-aliens.mp4',
		size: 11534401,
		processingStatus: 'succeeded',
		artifacts: {
			'poster_640.jpg': {
				url: '/file/6643202c-6d5d-428a-9db1-69f98164f0f6/artifact/poster_640.jpg/binary',
				processingStatus: 'succeeded',
				size: 1203,
				mimeType: 'image/jpeg',
				cdnUrl:
					'https://media-cdn.stg.atlassian.com/us-east-1/v1/cdn/file/6643202c-6d5d-428a-9db1-69f98164f0f6/artifact/poster_640.jpg/binary?token=some-token',
			},
			'poster.jpg': {
				url: '/file/6643202c-6d5d-428a-9db1-69f98164f0f6/artifact/poster_640.jpg/binary',
				processingStatus: 'succeeded',
				size: 1203,
				mimeType: 'image/jpeg',
			},
			'thumb_120.jpg': {
				url: '/file/6643202c-6d5d-428a-9db1-69f98164f0f6/artifact/thumb_120.jpg/binary',
				processingStatus: 'succeeded',
				size: 265,
				mimeType: 'image/jpeg',
				cdnUrl:
					'https://media-cdn.stg.atlassian.com/us-east-1/v1/cdn/file/6643202c-6d5d-428a-9db1-69f98164f0f6/artifact/thumb_120.jpg/binary?token=some-token',
			},
			'thumb.jpg': {
				url: '/file/6643202c-6d5d-428a-9db1-69f98164f0f6/artifact/thumb_120.jpg/binary',
				processingStatus: 'succeeded',
				size: 265,
				mimeType: 'image/jpeg',
			},
			'thumb_320.jpg': {
				url: '/file/6643202c-6d5d-428a-9db1-69f98164f0f6/artifact/thumb_320.jpg/binary',
				processingStatus: 'succeeded',
				size: 735,
				mimeType: 'image/jpeg',
			},
			'thumb_large.jpg': {
				url: '/file/6643202c-6d5d-428a-9db1-69f98164f0f6/artifact/thumb_320.jpg/binary',
				processingStatus: 'succeeded',
				size: 735,
				mimeType: 'image/jpeg',
			},
			'video_640.mp4': {
				url: '/file/6643202c-6d5d-428a-9db1-69f98164f0f6/artifact/video_640.mp4/binary',
				processingStatus: 'succeeded',
				size: 8788834,
				mimeType: 'video/mp4',
				cdnUrl:
					'https://media-cdn.stg.atlassian.com/us-east-1/v1/cdn/file/6643202c-6d5d-428a-9db1-69f98164f0f6/artifact/video_640.mp4/binary?token=some-token',
			},
			'video.mp4': {
				url: '/file/6643202c-6d5d-428a-9db1-69f98164f0f6/artifact/video_640.mp4/binary',
				processingStatus: 'succeeded',
				size: 8788834,
				mimeType: 'video/mp4',
			},
			ugc_caption_1111: {
				createdAt: 1741056854208,
				mimeType: `text/vtt;l=en;n=${btoa('sagan-aliens-en.vtt')}`,
				url: 'some-url',
				cdnUrl: 'some-cdn-url',
			},
			ugc_caption_2222: {
				createdAt: 1741056854208,
				mimeType: `text/vtt;l=es;n=${btoa('sagan-aliens-es.vtt')}`,
				url: 'some-url',
				cdnUrl: 'some-cdn-url',
			},
			ugc_caption_3333: {
				createdAt: 1741056854208,
				mimeType: `text/vtt;l=fr;n=${btoa('sagan-aliens-fr.vtt')}`,
				url: 'some-url',
				cdnUrl: 'some-cdn-url',
			},
			ugc_caption_4444: {
				createdAt: 1741056854208,
				mimeType: `text/vtt;l=zh;n=${btoa('sagan-aliens-zh.vtt')}`,
				url: 'some-url',
				cdnUrl: 'some-cdn-url',
			},
			ugc_caption_CORRUPTED: {
				createdAt: 1741056854208,
				mimeType: `text/vtt;l=en-CORRUPTED;n=${btoa('corrupted-captions.vtt')}`,
				url: 'some-url',
				cdnUrl: 'some-cdn-url',
			},
		},
		representations: {
			image: {},
		},
		hash: 'd76d10dd14f6c39de3d0d0ab0cb27c0bed0fb6ae',
		createdAt: 1741056854208,
	},
});

export const generateSampleFileItem = {
	workingImgWithRemotePreview,
	workingImgWithRemotePreviewInRecentsCollection,
	workingPdfWithRemotePreview,
	workingPdfWithoutRemotePreview,
	workingPdfWithLocalPreview,
	workingVideo,
	workingJpegWithRemotePreview,
	workingAudioWithoutRemotePreview,
	workingArchive,
	workingUnknown,
	workingGif,
	workingCode,
	workingCodeLarge,
	workingExcelWithLocalPreview,
	processingPdf,
	failedPdf,
	failedDoc,
	failedVideo,
	passwordPdf,
	svg,
	svgWithoutPreview,
	svgFailedProcessing,
	abuseImage,
	abuseSvg,
	abuseFailedVideo,
	abusePdfNoPreview,
	csv,
	spreadsheet,
	videoCaptions,
};
