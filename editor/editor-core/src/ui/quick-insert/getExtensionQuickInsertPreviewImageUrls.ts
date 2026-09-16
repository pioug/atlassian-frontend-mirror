import type { MenuItem } from '@atlaskit/editor-common/extensions';

type PreviewImageUrls = { dark: string; light: string };

const previewImageUrlsByTitle: Readonly<Record<string, PreviewImageUrls>> = {
	amplitude: {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/7v8shu6n3wd15644f3ys785628dkt632.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/2r34o120k40e0us4w66oqpud63o4lef4.png',
	},
	dropbox: {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/83f1773ur08qm4t3bqaabpwb173313tg.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/37v2dk5n1ltwc82j1w76dv1tyr8puwq0.png',
	},
	figma: {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/svedc2lju60bgq3r43kfmi7213wj46as.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/u80s30071b4c10vdjr5rw0uje8cu2pk7.png',
	},
	'google drive': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/y01wj4t58w86byx86l6k81a22axud131.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/wi413m0837rjykg23r6y0256b7377185.png',
	},
	iframe: {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/77p6d5rb343gue8580bacbl0xf82u5jv.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/72a0j8eddxg82rnp8j48bipi8sq8g0ke.png',
	},
};

export const getExtensionQuickInsertPreviewImageUrls = (
	item: Pick<MenuItem, 'title'>,
): PreviewImageUrls | undefined => previewImageUrlsByTitle[item.title.toLowerCase()];
