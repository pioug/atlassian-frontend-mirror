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
		['blog-posts', '5n54qb4j1pn588ud6604eh4c8hj5422v'],
		['change-history', 'u83vu4k3if5kh4a12e34pr5jf833e71l'],
		['children', 'ttbt2qi6tkl6cgdyig1th4x837g3c018'],
		['details', '857b0i4hxk3pxeq3h5v2ykfav4niv5hx'],
		['detailssummary', '07k170i7odd417hvcpkp800353211gwi'],
		['content-report-table', '060xk53i83jkbc5m5op8v44887tv3038'],
		['pagetree', 'kji77816l70343e211ll54222q3i0m57'],
		['contributors', '22801wwe6yf82mcfcrd7vg54620p5e0g'],
		['contentbylabel', '8hy8d25516esmq4q267bf15483851454'],
		['listlabels', '1a51b87u6bvsq84pup1wy1n32pg2s6c7'],
		['livesearch', '0n8ie724cnnvl62w1m521k8eq5v73u76'],
		['pagetreesearch', 'w7o6smtuy41bg08327dy2ai0fht2lc6m'],
		['popular-labels', 'a2x44n7aasba646mlmqht7cqfq6k8783'],
		['recently-updated', 'g2vqf86yj16fi74mny6b265mw5l181fx'],
		['tasks-report-macro', 'e7qda5xter48ao38ieq82jgv3m7j3g8c'],
		['calendar', 'g7v75uv8mw0i7hw36181xx2nly2674pi'],
		['userlister', '4883g3sm4pdy8w3mmphdqj81588c37gf'],
		['profile', 'o2kexap23ijq8jeqhpvi8lgc51dex3wj'],
	] as const)(
		'uses the Data and charts preview registered for extension key %s',
		(extensionKey, lightAssetId) => {
			expect(
				getExtensionQuickInsertPreviewImageUrls({
					extensionKey,
					key: `manifest:${extensionKey}`,
					title: 'Unrelated title',
				}),
			).toMatchObject({
				light: expect.stringContaining(lightAssetId),
			});
		},
	);

	it.each([
		['Database', 'database-extension:create-database', 'lqqxkx57ue3ws60m642br54ss6m3neow'],
		['Embed database', 'database-extension:reference-database', 'he1vu1p7ngbjcy6lw8i8vh601aw14ct1'],
		['Decision report', 'decisionreport:decisionreport', '3347ejx66xy7y375s232mbeg0ia1rdm8'],
		[
			'Questions List Native',
			'questionslist-macro-native:questionslist-macro-native',
			'4f6f51758m5m6nu06x557nm115613233',
		],
	] as const)(
		'uses the Data and charts preview for %s by runtime key',
		(title, key, lightAssetId) => {
			expect(getExtensionQuickInsertPreviewImageUrls({ key, title })).toMatchObject({
				light: expect.stringContaining(lightAssetId),
			});
		},
	);

	it('uses the Spaces preview for the environment-specific Spaces gadget runtime key', () => {
		expect(
			getExtensionQuickInsertPreviewImageUrls({
				extensionKey: 'gadget',
				key: 'gadget:gadget-077a293d126313a494b9137894f60bda03d2df22dbb69c8b1c6a345922b501ec',
				title: 'Spaces',
			}),
		).toMatchObject({
			light: expect.stringContaining('b3py8prmf21tl73nb42gc67a0i437o1q'),
		});
		expect(
			getExtensionQuickInsertPreviewImageUrls({
				extensionKey: 'gadget',
				key: 'gadget:gadget-another-gadget',
				title: 'Another gadget',
			}),
		).toBeUndefined();
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
