import type { MenuItem } from '@atlaskit/editor-common/extensions';

type PreviewImageUrls = { dark: string; light: string };

const googleDrivePreviewImageUrls: PreviewImageUrls = {
	dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/y01wj4t58w86byx86l6k81a22axud131.png',
	light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/wi413m0837rjykg23r6y0256b7377185.png',
};

const dataAndChartsPreviewImageUrlsByKey: Readonly<Record<string, PreviewImageUrls>> = {
	'quick-insert-assets-menu-item': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/64d41r462m2343iomn821ver0g4ohh37.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/0w58rc60jh54m68224qqinuk52d6lldt.png',
	},
	'blog-posts': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/syvwj7cg10q6n1586u2l64q78o2dc54d.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/5n54qb4j1pn588ud6604eh4c8hj5422v.png',
	},
	'change-history': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/623tjta5b2flb1b7lf3t0dp6r4c858v5.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/u83vu4k3if5kh4a12e34pr5jf833e71l.png',
	},
	children: {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/a0qd7lp8011o238rmf3m872hb765y2g1.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/ttbt2qi6tkl6cgdyig1th4x837g3c018.png',
	},
	details: {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/11j376ovg761h7o2vfr0l6n8okxf22m4.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/857b0i4hxk3pxeq3h5v2ykfav4niv5hx.png',
	},
	detailssummary: {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/566j328lm7022fx64cv77w8xtyodre44.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/07k170i7odd417hvcpkp800353211gwi.png',
	},
	'content-report-table': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/ewhj8d8216yc6lyny58l2w4h3nikbs06.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/060xk53i83jkbc5m5op8v44887tv3038.png',
	},
	pagetree: {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/8g3qkn50t2m3n05465s783f54517su0j.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/kji77816l70343e211ll54222q3i0m57.png',
	},
	contributors: {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/f115sn7v8x2oo65outd1g7124u03dfj1.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/22801wwe6yf82mcfcrd7vg54620p5e0g.png',
	},
	'database-extension:create-database': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/65m57812l47f0a55qpm51t8glk24vsne.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/lqqxkx57ue3ws60m642br54ss6m3neow.png',
	},
	'decisionreport:decisionreport': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/1w6a5k5f1yndoy2g3j158n151020v71y.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/3347ejx66xy7y375s232mbeg0ia1rdm8.png',
	},
	'database-extension:reference-database': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/5b815435xso5xv248niy0dg3m3yr2w6c.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/he1vu1p7ngbjcy6lw8i8vh601aw14ct1.png',
	},
	contentbylabel: {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/3i6n45of3ks7lm5v65k74r0580mqya62.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/8hy8d25516esmq4q267bf15483851454.png',
	},
	'quick-insert-confluence-list-menu-item': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/8jh31f0k143b475y5tun230v166c7087.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/6co68akkw56t83fql3m823qi21k8776u.png',
	},
	'quick-insert-jira-work-items-menu-item': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/m284qw5066530tr5yd11473uq1l8t86t.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/4b1455q46emetd0jxv70xuo7i7lwo574.png',
	},
	listlabels: {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/3k50k14u80g034t323q3m13m6820ag70.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/1a51b87u6bvsq84pup1wy1n32pg2s6c7.png',
	},
	livesearch: {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/80v4vx47y130st85qx46432fo18g0sbx.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/0n8ie724cnnvl62w1m521k8eq5v73u76.png',
	},
	pagetreesearch: {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/g32sx54apgb3yt844qi4y28gu835q682.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/w7o6smtuy41bg08327dy2ai0fht2lc6m.png',
	},
	'popular-labels': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/oqgl5347hqmx6u3v837q1bh2q70ls7bd.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/a2x44n7aasba646mlmqht7cqfq6k8783.png',
	},
	'questionslist-macro-native:questionslist-macro-native': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/37x027653yfd01ik041qnf005f1j5867.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/4f6f51758m5m6nu06x557nm115613233.png',
	},
	'recently-updated': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/g4y1gsehg600ge0nem6r2xv4b0ga7106.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/g2vqf86yj16fi74mny6b265mw5l181fx.png',
	},
	'gadget:spaces': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/jw8r2233444raq4p3v56obq230hh5a8n.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/b3py8prmf21tl73nb42gc67a0i437o1q.png',
	},
	'tasks-report-macro': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/n2lm728m8n7au2q455wy57m407a8i74b.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/e7qda5xter48ao38ieq82jgv3m7j3g8c.png',
	},
	calendar: {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/01d5gi6lifcsu5el861v8p7kw84ja8it.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/g7v75uv8mw0i7hw36181xx2nly2674pi.png',
	},
	userlister: {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/5cy6l23fwmo2820uce5m50g1222l0hpb.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/4883g3sm4pdy8w3mmphdqj81588c37gf.png',
	},
	profile: {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/evx8rg04mer8binf15e8ao0imm5kv7ek.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/o2kexap23ijq8jeqhpvi8lgc51dex3wj.png',
	},
};

const previewImageUrlsByKey: Readonly<Record<string, PreviewImageUrls>> = {
	...dataAndChartsPreviewImageUrlsByKey,
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
	item: Pick<MenuItem, 'title'> & Partial<Pick<MenuItem, 'extensionKey' | 'key'>>,
): PreviewImageUrls | undefined => {
	const normalizedTitle = item.title.toLowerCase();

	return (
		(item.key ? previewImageUrlsByKey[item.key] : undefined) ??
		(item.extensionKey === 'gadget'
			? dataAndChartsPreviewImageUrlsByKey[`${item.extensionKey}:${normalizedTitle}`]
			: undefined) ??
		(item.extensionKey ? dataAndChartsPreviewImageUrlsByKey[item.extensionKey] : undefined) ??
		previewImageUrlsByTitle[normalizedTitle]
	);
};
