import { getExtensionQuickInsertPreviewImageUrls } from '../getExtensionQuickInsertPreviewImageUrls';

describe('getExtensionQuickInsertPreviewImageUrls', () => {
	it.each([
		[
			'Amplitude',
			'third-party-quick-insert-embeds:third-party-embed-amplitude',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/2r34o120k40e0us4w66oqpud63o4lef4.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/7v8shu6n3wd15644f3ys785628dkt632.png',
		],
		[
			'Dropbox',
			'dropbox:item',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/37v2dk5n1ltwc82j1w76dv1tyr8puwq0.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/83f1773ur08qm4t3bqaabpwb173313tg.png',
		],
		[
			'Figma',
			'third-party-quick-insert-embeds:third-party-embed-figma',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/u80s30071b4c10vdjr5rw0uje8cu2pk7.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/svedc2lju60bgq3r43kfmi7213wj46as.png',
		],
		[
			'Google Drive',
			'third-party-quick-insert-embeds:third-party-embed-google-drive',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/wi413m0837rjykg23r6y0256b7377185.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/y01wj4t58w86byx86l6k81a22axud131.png',
		],
		[
			'legacy Google Drive',
			'google-drive:item',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/wi413m0837rjykg23r6y0256b7377185.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/y01wj4t58w86byx86l6k81a22axud131.png',
		],
		[
			'iframe',
			'iframe:iframe',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/72a0j8eddxg82rnp8j48bipi8sq8g0ke.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/77p6d5rb343gue8580bacbl0xf82u5jv.png',
		],
	] as const)('uses the approved %s previews by key', (title, key, light, dark) => {
		expect(getExtensionQuickInsertPreviewImageUrls({ key, title })).toEqual({ dark, light });
	});

	it.each([
		[
			'Amplitude',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/2r34o120k40e0us4w66oqpud63o4lef4.png',
		],
		[
			'Dropbox',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/37v2dk5n1ltwc82j1w76dv1tyr8puwq0.png',
		],
		['Figma', 'https://dam-cdn.atl.orangelogic.com/AssetLink/u80s30071b4c10vdjr5rw0uje8cu2pk7.png'],
		[
			'Google Drive',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/wi413m0837rjykg23r6y0256b7377185.png',
		],
		[
			'iframe',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/72a0j8eddxg82rnp8j48bipi8sq8g0ke.png',
		],
	] as const)('uses the %s title fallback', (title, light) => {
		expect(getExtensionQuickInsertPreviewImageUrls({ title })).toMatchObject({ light });
	});

	it.each([
		[
			'Profile Picture',
			'profile-picture:profile-picture',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/4o3lpe2eh4nlakav375621i73do50kyx.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/35rb2mbxc2dt8p7op8u8lyss5h220428.png',
		],
		[
			'Whiteboard',
			'whiteboard-extension:create-whiteboard',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/k177s112506n0bn788227s0ig45nko57.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/4u6tb8343dv71eotl5462nydlq3544ut.png',
		],
		[
			'Diagram',
			'whiteboard-extension:create-diagram',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/3qcyi8f2l7020lf8t2630h76psa8sef2.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/b53mwb352cu4m2ic376r3a7l8xcb2lp8.png',
		],
		[
			'Flowchart',
			'whiteboard-extension:create-flowchart',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/3mq78tb8481m3axkf16qp24pv16s0n37.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/7wnhq0ag04nnvr555538abm5uln826r5.png',
		],
		[
			'Brainstorm session',
			'whiteboard-extension:create-brainstorming',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/5i7opmkn02g8a163v0udjrn15723ti65.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/6t0pky2s6s802i85x3xrl2jkliln4k10.png',
		],
		[
			'Retrospective',
			'whiteboard-extension:create-retrospective',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/0ya7355442s42m56283l5q1erekh4278.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/ha5g3fvhi18174t4ua8v3f1xbgg5aqle.png',
		],
		[
			'Roadmap',
			'whiteboard-extension:create-roadmap',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/8nqml2m2w0n3jeah3x5y8ydr7u8dmn7t.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/q86286x2vfn2dly7sajy32iaj4o506iy.png',
		],
	] as const)('uses the approved %s previews by key', (title, key, light, dark) => {
		expect(getExtensionQuickInsertPreviewImageUrls({ key, title })).toEqual({ dark, light });
	});

	it.each([
		'toc:toc',
		'native-tabs:native-tabs',
		'cards:quick-insert',
		'carousel:quick-insert',
		'spotlight:quick-insert',
		'com.atlassian.linking-platform.create:linking-platform-create-jira-issue',
		'com.atlassian.linking-platform.create:linking-platform-create-confluence-page',
		'anchor:anchor',
		'smart-button:quick-insert',
	])('uses the approved previews for the %s extension', (key) => {
		expect(getExtensionQuickInsertPreviewImageUrls({ key, title: key })).toEqual({
			dark: expect.stringContaining('dam-cdn.atl.orangelogic.com/AssetLink/'),
			light: expect.stringContaining('dam-cdn.atl.orangelogic.com/AssetLink/'),
		});
	});

	it('does not assign a preview to other extension items', () => {
		expect(getExtensionQuickInsertPreviewImageUrls({ title: 'Jira issue' })).toBeUndefined();
		expect(
			getExtensionQuickInsertPreviewImageUrls({
				key: 'whiteboard-extension:create-roadmap-planning',
				title: 'Roadmap planning',
			}),
		).toBeUndefined();
	});
});
