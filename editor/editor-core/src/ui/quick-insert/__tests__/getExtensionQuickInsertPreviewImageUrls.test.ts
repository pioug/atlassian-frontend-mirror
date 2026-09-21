import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';

import { getExtensionQuickInsertPreviewImageUrls } from '../getExtensionQuickInsertPreviewImageUrls';

describe('getExtensionQuickInsertPreviewImageUrls', () => {
	it('resolves a block template preview by snippet ID independently of its localized title', () => {
		mockExpEnabled('platform_editor_slash_command');
		expect(
			getExtensionQuickInsertPreviewImageUrls({
				key: 'snippet-extension:snippet-019e5cd9-5ca1-7258-befd-1c3c59b0aa00',
				title: 'Localized bug report',
			}),
		).toEqual({
			light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/221f56s64c186314ka8a7uaj7m4di32l.png',
			dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/1c86e0v3ygh5ct5600luum0w67unpa23.png',
		});
	});

	it('does not assign an unrelated title preview to an unknown snippet', () => {
		mockExpEnabled('platform_editor_slash_command');
		expect(
			getExtensionQuickInsertPreviewImageUrls({
				key: 'snippet-extension:snippet-unknown-id',
				title: 'Figma',
			}),
		).toBeUndefined();
	});

	it('does not resolve block template previews when slash commands are disabled', () => {
		mockExpDisabled('platform_editor_slash_command');
		expect(
			getExtensionQuickInsertPreviewImageUrls({
				key: 'snippet-extension:snippet-019e5cd9-5ca1-7258-befd-1c3c59b0aa00',
				title: 'Bug report',
			}),
		).toBeUndefined();
	});

	it.each([
		[
			'Excel',
			'viewxls:viewxls',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/r426m140lbp7gs2gxbe015e21kf23j8l.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/b11p6ksb8r6j6g2604p67ab53f23u6f5.png',
		],
		[
			'Excerpt',
			'excerpt:excerpt',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/0j5s4a60jjbrq3yoa7kfnkft28403127.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/1h408wk0e4x6efhby84hbc583nx5b0b5.png',
		],
		[
			'Include content (Include page)',
			'include:include',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/61yskd00re82i80b8r6pfxp60pi4852s.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/s12155hkaoc81aa0eh58y54402s8t346.png',
		],
		[
			'Insert excerpt',
			'excerpt-include:excerpt-include',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/y373d21g768gmvjao5db38kw4460m72r.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/dg718ggxcx60dj7ng86fpqmwbv7vauny.png',
		],
		[
			'JIRA Charts',
			'jirachart:jirachart',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/114de8qe6dy877s65xh1a2dil1r86x73.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/30g82ea1p64616h40s110ysud47dnof6.png',
		],
		[
			'Jira Data Center',
			'jira:jira',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/pdnn81xj6e8v56nye6rnft3rd4yhnc05.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/8ttib573524136b5lffq3a1go05x507d.png',
		],
		[
			'Jira premium plan',
			'portfolioforjiraplan:portfolioforjiraplan',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/c2hy8b245yg1dt2776ol5sx57n045nv0.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/24g0yt8c54671463162f5q455qcki3id.png',
		],
		[
			'Opsgenie Incident Timeline EU',
			'opsgenie-incident-timeline-eu-macro:opsgenie-incident-timeline-eu-macro',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/qnq1bn07a3k0v4m10hoi487p837obx53.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/qo0u146811738ixd6l13nud48pv57510.png',
		],
		[
			'PDF',
			'viewpdf:viewpdf',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/30u3v86x652ah52ruhqj1ap0s0ve4ey2.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/jt685rp527nfo8jqp6o5o0r31l3rpfux.png',
		],
		[
			'Shared Links Bookmarklet Button',
			'sharelinks-urlmacro:sharelinks-urlmacro',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/myhw531c3748qn4ro51vf450vk0qg481.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/0028h1741o411uw4qi8icbg138kus32e.png',
		],
		[
			'Table of Content Zone',
			'toc-zone:toc-zone',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/s4q2ap8q4135r0r3i1tym1d5koxdonb1.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/1p16277ig16wc6kelloa542k33b18mm2.png',
		],
	] as const)('uses the approved %s previews only by key', (title, key, light, dark) => {
		expect(getExtensionQuickInsertPreviewImageUrls({ key, title })).toEqual({ dark, light });
		expect(getExtensionQuickInsertPreviewImageUrls({ title })).toBeUndefined();
	});

	it.each([
		[
			'Activity Stream',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/nh7404rduyw5tbne4143426evuk7hvg8.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/7v3a1rvva7gxr874o5qah5k61365hod5.png',
		],
		[
			'Agile Wallboard Gadget',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/3o7vtt14rtpe3sna7mras6oih86nssb6.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/n611u81ca8fkyv5nk6cl6j1081e805tr.png',
		],
		[
			'Assigned to Me',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/5c62343jh3411ido38440xx0007cx6ls.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/d72jy2r18q6v06s13k2f6x3fymrr4on7.png',
		],
		[
			'Average Age Chart',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/t136146lvs3x60456gnsghtv730uaftn.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/i53kn1igq64m5dip4eg1030j15yd7xxe.png',
		],
		[
			'Average Number of Times in Status',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/16v2eq2c1df0mrf2jo6xic526527nfh1.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/u4v77u1lwcy5g08y047q33dbiv42dkit.png',
		],
		[
			'Days Remaining in Sprint Gadget',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/41j35y64652g06uru332kt2a0pk77j03.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/805320gvqd6cbr23yrv271oas2u061s5.png',
		],
		[
			'Filter Results',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/j706ug0u5nk40i1lhrt05j63grc36x0u.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/w0n60p750b2275k226gri2j6i366jt0e.png',
		],
		[
			'Heat Map',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/w574xrh77oxbmb18f0ro1bd80x417426.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/qoepx85h21t4u00cht35nc3ssl4i72j5.png',
		],
		[
			'Issues in progress',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/go2d8b1qs7h07b17326lx8r8p28jm011.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/666u7h3tp16ad4k8u24d4u1155n1v7hg.png',
		],
		[
			'Jira Issues Calendar',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/j23063ot2a014a2a51y6i0o1keo0kanr.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/13o0sk45vlf25x1m3w14gsy146k25b14.png',
		],
		[
			'Jira Road Map',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/q23v3a23018y2856kew3fsork63bg6p2.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/h6u3kb7116jr12w3f586stmc850827h3.png',
		],
		[
			'Labels Gadget',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/42hjlte7y364o8y4e5udkl11o22a2ac3.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/7u8gpvv82s3e2833204nm6m1k3301c46.png',
		],
		[
			'Pie Chart',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/pdq60d803b655il4x3m0co608guc56ub.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/v4b6d7to551136834oe1a0xx66n7mv5e.png',
		],
		[
			'Quick links',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/k51qkw636t010l5h1vrs05c7i073y0xp.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/onlh3rc6p0qj15rsysxa3ep5b183hk40.png',
		],
		[
			'Recently Created Chart',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/ia4jrrsg4mw8tu0gtj88d2yr5w6s20fm.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/t5in18tcubtbr18yv1gr0ap26x7d6bh3.png',
		],
		[
			'Resolution Time',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/msw0hn3462vvai4l4jkp50xcm87741j6.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/3dek0066jn31qfkk2l2hn011um087y72.png',
		],
		[
			'Sprint Burndown Gadget',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/qic3bcq5sqhd7r00qpj3i6240n3uw3fp.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/2qqrp3vl4rv2p443566826jadj38rfrj.png',
		],
		[
			'Sprint Health Gadget',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/pnngo5y00g18eos4je3r20ga0c666c68.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/uoqla656675p5wwc3a8v824768lip528.png',
		],
		[
			'Time Since Chart',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/20wj0kb8mjjj7in0hu62j4ska17ug5s3.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/f7g8053ww4deogfid2h2pj2nw6n8582u.png',
		],
		[
			'Time to First Response',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/8kkdphd2l3gb7w06dboc82rmtm86xk7r.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/l4cy50n75hr166cpohxpd3h5038e8sl7.png',
		],
		[
			'Two Dimensional Filter Statistics',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/hjt70wg3tds43ev34nxv1r7l50170f4l.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/6s1x266h56m7p4q758jem2k03hbu15gb.png',
		],
		[
			'Version Report',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/rgi5il8d845k40f65w0f8a678c1rf51q.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/2143nj51e834657316q5n5j6kbq3h3m7.png',
		],
		[
			'Voted Work Items',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/rcn6qrr638k1v5y6xrw8g512f2530244.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/0n262m847lgjj174x658ps04k6j513r6.png',
		],
		[
			'Watched Issues',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/mv0w504r53gvkx38g3y74pd65k5hktop.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/v418o500l40ga5gtq6m23x5t17k47wbe.png',
		],
		[
			'Work Item Statistics',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/l3120n2755pw6r2o2q24tmsgu6658533.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/4315hi70mlh4eqbn6215p10s4il7os34.png',
		],
		[
			'Workload Pie Chart',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/84tce4xo2nqe0712oil1f08n5160a11v.png',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/v5j8p100viey44g61cdc61d53465gda5.png',
		],
	] as const)(
		'uses the approved %s previews by composed gadget extension key and normalized title',
		(title, light, dark) => {
			expect(
				getExtensionQuickInsertPreviewImageUrls({
					extensionKey: 'gadget',
					key: 'gadget:environment-specific-id',
					title,
				}),
			).toEqual({ dark, light });
			expect(getExtensionQuickInsertPreviewImageUrls({ title })).toBeUndefined();
			expect(
				getExtensionQuickInsertPreviewImageUrls({ extensionKey: 'not-gadget', title }),
			).toBeUndefined();
		},
	);

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

	it.each(['Amplitude', 'Dropbox', 'Figma', 'Google Drive', 'iframe'])(
		'does not use the %s title as a preview fallback',
		(title) => {
			expect(getExtensionQuickInsertPreviewImageUrls({ title })).toBeUndefined();
		},
	);

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
