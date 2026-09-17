import type { MenuItem } from '@atlaskit/editor-common/extensions';

type PreviewImageUrls = { dark: string; light: string };

const googleDrivePreviewImageUrls: PreviewImageUrls = {
	dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/y01wj4t58w86byx86l6k81a22axud131.png',
	light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/wi413m0837rjykg23r6y0256b7377185.png',
};

const previewImageUrlsByKey: Readonly<Record<string, PreviewImageUrls>> = {
	'profile-picture:profile-picture': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/35rb2mbxc2dt8p7op8u8lyss5h220428.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/4o3lpe2eh4nlakav375621i73do50kyx.png',
	},
	'whiteboard-extension:create-brainstorming': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/6t0pky2s6s802i85x3xrl2jkliln4k10.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/5i7opmkn02g8a163v0udjrn15723ti65.png',
	},
	'whiteboard-extension:create-diagram': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/b53mwb352cu4m2ic376r3a7l8xcb2lp8.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/3qcyi8f2l7020lf8t2630h76psa8sef2.png',
	},
	'whiteboard-extension:create-flowchart': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/7wnhq0ag04nnvr555538abm5uln826r5.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/3mq78tb8481m3axkf16qp24pv16s0n37.png',
	},
	'whiteboard-extension:create-retrospective': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/ha5g3fvhi18174t4ua8v3f1xbgg5aqle.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/0ya7355442s42m56283l5q1erekh4278.png',
	},
	'whiteboard-extension:create-roadmap': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/q86286x2vfn2dly7sajy32iaj4o506iy.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/8nqml2m2w0n3jeah3x5y8ydr7u8dmn7t.png',
	},
	'whiteboard-extension:create-whiteboard': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/4u6tb8343dv71eotl5462nydlq3544ut.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/k177s112506n0bn788227s0ig45nko57.png',
	},
	'third-party-quick-insert-embeds:third-party-embed-amplitude': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/7v8shu6n3wd15644f3ys785628dkt632.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/2r34o120k40e0us4w66oqpud63o4lef4.png',
	},
	'dropbox:item': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/83f1773ur08qm4t3bqaabpwb173313tg.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/37v2dk5n1ltwc82j1w76dv1tyr8puwq0.png',
	},
	'third-party-quick-insert-embeds:third-party-embed-figma': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/svedc2lju60bgq3r43kfmi7213wj46as.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/u80s30071b4c10vdjr5rw0uje8cu2pk7.png',
	},
	'third-party-quick-insert-embeds:third-party-embed-google-drive': googleDrivePreviewImageUrls,
	'google-drive:item': googleDrivePreviewImageUrls,
	'iframe:iframe': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/77p6d5rb343gue8580bacbl0xf82u5jv.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/72a0j8eddxg82rnp8j48bipi8sq8g0ke.png',
	},
	'anchor:anchor': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/5f440bb8m37yig3u77s6c8200re8mto0.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/y42w6i56fk22vb3g5120d43qfwte8a78.png',
	},
	'cards:quick-insert': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/20cikbp248b6uuagmv870057c46b546m.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/1jdjwc5fe5q64gf4f6i6i66tp361fv86.png',
	},
	'carousel:quick-insert': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/20g273op21fx0t521ap2xg3b36125vpa.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/d5t273i2jkax3c2223172a15kpqxww35.png',
	},
	'com.atlassian.linking-platform.create:linking-platform-create-confluence-page': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/3n23b6b5h222r3v068bt32dvx54l5f21.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/bo85x7j087bjb2q45rb14nx2yf18k6l7.png',
	},
	'com.atlassian.linking-platform.create:linking-platform-create-jira-issue': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/r8200b630kethcrda0fbs4nt7j180715.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/0n02x8u7ip23y371rkval1ggq5qk738i.png',
	},
	'native-tabs:native-tabs': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/hvdl25h7i4xrv1gfxc8yo04nkfk63acq.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/n857jlk2ahk2ymsh6derrt3sy75l026j.png',
	},
	'smart-button:quick-insert': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/101m1324u46r06ksvg8ak64s2u0vm7l7.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/3cqw35441m20336hn04h731532i1x2pe.png',
	},
	'spotlight:quick-insert': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/x2qdma2vfrd7h55vp5i4x66fr42b877w.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/ngi4osf40j5e37flt8e1pqw345pc346v.png',
	},
	'toc:toc': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/7jj541q4pq1joqf0ar53j42kr6371t1t.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/v8eyy0fvu61fb8a4b4teea4pjs7g2842.png',
	},
};

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
	'google drive': googleDrivePreviewImageUrls,
	iframe: {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/77p6d5rb343gue8580bacbl0xf82u5jv.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/72a0j8eddxg82rnp8j48bipi8sq8g0ke.png',
	},
};

export const getExtensionQuickInsertPreviewImageUrls = (
	item: Pick<MenuItem, 'title'> & Partial<Pick<MenuItem, 'key'>>,
): PreviewImageUrls | undefined =>
	(item.key ? previewImageUrlsByKey[item.key] : undefined) ??
	previewImageUrlsByTitle[item.title.toLowerCase()];
