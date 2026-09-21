import type { MenuItem } from '@atlaskit/editor-common/extensions';
import { getSnippetPreviewImageUrls } from '@atlaskit/editor-common/quick-insert/snippet-preview-image-urls';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

type PreviewImageUrls = { dark: string; light: string };

const embedPreviewImageUrlsByKey: Readonly<Record<string, PreviewImageUrls>> = {
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
	'third-party-quick-insert-embeds:third-party-embed-google-drive': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/y01wj4t58w86byx86l6k81a22axud131.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/wi413m0837rjykg23r6y0256b7377185.png',
	},
	'iframe:iframe': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/77p6d5rb343gue8580bacbl0xf82u5jv.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/72a0j8eddxg82rnp8j48bipi8sq8g0ke.png',
	},
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

const otherPreviewImageUrlsByKey: Readonly<Record<string, PreviewImageUrls>> = {
	'excerpt:excerpt': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/1h408wk0e4x6efhby84hbc583nx5b0b5.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/0j5s4a60jjbrq3yoa7kfnkft28403127.png',
	},
	'excerpt-include:excerpt-include': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/dg718ggxcx60dj7ng86fpqmwbv7vauny.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/y373d21g768gmvjao5db38kw4460m72r.png',
	},
	'include:include': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/s12155hkaoc81aa0eh58y54402s8t346.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/61yskd00re82i80b8r6pfxp60pi4852s.png',
	},
	'jirachart:jirachart': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/30g82ea1p64616h40s110ysud47dnof6.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/114de8qe6dy877s65xh1a2dil1r86x73.png',
	},
	'jira:jira': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/8ttib573524136b5lffq3a1go05x507d.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/pdnn81xj6e8v56nye6rnft3rd4yhnc05.png',
	},
	'portfolioforjiraplan:portfolioforjiraplan': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/24g0yt8c54671463162f5q455qcki3id.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/c2hy8b245yg1dt2776ol5sx57n045nv0.png',
	},
	'opsgenie-incident-timeline-eu-macro:opsgenie-incident-timeline-eu-macro': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/qo0u146811738ixd6l13nud48pv57510.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/qnq1bn07a3k0v4m10hoi487p837obx53.png',
	},
	'sharelinks-urlmacro:sharelinks-urlmacro': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/0028h1741o411uw4qi8icbg138kus32e.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/myhw531c3748qn4ro51vf450vk0qg481.png',
	},
	'toc-zone:toc-zone': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/1p16277ig16wc6kelloa542k33b18mm2.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/s4q2ap8q4135r0r3i1tym1d5koxdonb1.png',
	},
	'viewpdf:viewpdf': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/jt685rp527nfo8jqp6o5o0r31l3rpfux.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/30u3v86x652ah52ruhqj1ap0s0ve4ey2.png',
	},
	'viewxls:viewxls': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/b11p6ksb8r6j6g2604p67ab53f23u6f5.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/r426m140lbp7gs2gxbe015e21kf23j8l.png',
	},
	'gadget:activity stream': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/7v3a1rvva7gxr874o5qah5k61365hod5.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/nh7404rduyw5tbne4143426evuk7hvg8.png',
	},
	'gadget:agile wallboard gadget': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/n611u81ca8fkyv5nk6cl6j1081e805tr.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/3o7vtt14rtpe3sna7mras6oih86nssb6.png',
	},
	'gadget:assigned to me': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/d72jy2r18q6v06s13k2f6x3fymrr4on7.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/5c62343jh3411ido38440xx0007cx6ls.png',
	},
	'gadget:average age chart': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/i53kn1igq64m5dip4eg1030j15yd7xxe.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/t136146lvs3x60456gnsghtv730uaftn.png',
	},
	'gadget:average number of times in status': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/u4v77u1lwcy5g08y047q33dbiv42dkit.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/16v2eq2c1df0mrf2jo6xic526527nfh1.png',
	},
	'gadget:days remaining in sprint gadget': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/805320gvqd6cbr23yrv271oas2u061s5.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/41j35y64652g06uru332kt2a0pk77j03.png',
	},
	'gadget:filter results': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/w0n60p750b2275k226gri2j6i366jt0e.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/j706ug0u5nk40i1lhrt05j63grc36x0u.png',
	},
	'gadget:heat map': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/qoepx85h21t4u00cht35nc3ssl4i72j5.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/w574xrh77oxbmb18f0ro1bd80x417426.png',
	},
	'gadget:issues in progress': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/666u7h3tp16ad4k8u24d4u1155n1v7hg.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/go2d8b1qs7h07b17326lx8r8p28jm011.png',
	},
	'gadget:jira issues calendar': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/13o0sk45vlf25x1m3w14gsy146k25b14.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/j23063ot2a014a2a51y6i0o1keo0kanr.png',
	},
	'gadget:jira road map': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/h6u3kb7116jr12w3f586stmc850827h3.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/q23v3a23018y2856kew3fsork63bg6p2.png',
	},
	'gadget:labels gadget': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/7u8gpvv82s3e2833204nm6m1k3301c46.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/42hjlte7y364o8y4e5udkl11o22a2ac3.png',
	},
	'gadget:pie chart': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/v4b6d7to551136834oe1a0xx66n7mv5e.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/pdq60d803b655il4x3m0co608guc56ub.png',
	},
	'gadget:quick links': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/onlh3rc6p0qj15rsysxa3ep5b183hk40.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/k51qkw636t010l5h1vrs05c7i073y0xp.png',
	},
	'gadget:recently created chart': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/t5in18tcubtbr18yv1gr0ap26x7d6bh3.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/ia4jrrsg4mw8tu0gtj88d2yr5w6s20fm.png',
	},
	'gadget:resolution time': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/3dek0066jn31qfkk2l2hn011um087y72.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/msw0hn3462vvai4l4jkp50xcm87741j6.png',
	},
	'gadget:sprint burndown gadget': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/2qqrp3vl4rv2p443566826jadj38rfrj.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/qic3bcq5sqhd7r00qpj3i6240n3uw3fp.png',
	},
	'gadget:sprint health gadget': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/uoqla656675p5wwc3a8v824768lip528.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/pnngo5y00g18eos4je3r20ga0c666c68.png',
	},
	'gadget:time since chart': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/f7g8053ww4deogfid2h2pj2nw6n8582u.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/20wj0kb8mjjj7in0hu62j4ska17ug5s3.png',
	},
	'gadget:time to first response': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/l4cy50n75hr166cpohxpd3h5038e8sl7.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/8kkdphd2l3gb7w06dboc82rmtm86xk7r.png',
	},
	'gadget:two dimensional filter statistics': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/6s1x266h56m7p4q758jem2k03hbu15gb.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/hjt70wg3tds43ev34nxv1r7l50170f4l.png',
	},
	'gadget:version report': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/2143nj51e834657316q5n5j6kbq3h3m7.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/rgi5il8d845k40f65w0f8a678c1rf51q.png',
	},
	'gadget:voted work items': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/0n262m847lgjj174x658ps04k6j513r6.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/rcn6qrr638k1v5y6xrw8g512f2530244.png',
	},
	'gadget:watched issues': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/v418o500l40ga5gtq6m23x5t17k47wbe.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/mv0w504r53gvkx38g3y74pd65k5hktop.png',
	},
	'gadget:work item statistics': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/4315hi70mlh4eqbn6215p10s4il7os34.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/l3120n2755pw6r2o2q24tmsgu6658533.png',
	},
	'gadget:workload pie chart': {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/v5j8p100viey44g61cdc61d53465gda5.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/84tce4xo2nqe0712oil1f08n5160a11v.png',
	},
};

const previewImageUrlsByKey: Readonly<Record<string, PreviewImageUrls>> = {
	...dataAndChartsPreviewImageUrlsByKey,
	...embedPreviewImageUrlsByKey,
	...otherPreviewImageUrlsByKey,
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

export const getExtensionQuickInsertPreviewImageUrls = (
	item: Pick<MenuItem, 'title'> & Partial<Pick<MenuItem, 'extensionKey' | 'key'>>,
): PreviewImageUrls | undefined => {
	const snippetKeyPrefix = 'snippet-extension:snippet-';
	if (item.key?.startsWith(snippetKeyPrefix)) {
		return isExperimentEnabled('platform_editor_slash_command')
			? getSnippetPreviewImageUrls(item.key.slice(snippetKeyPrefix.length))
			: undefined;
	}

	const normalizedTitle = item.title.toLowerCase();

	return (
		(item.key ? previewImageUrlsByKey[item.key] : undefined) ??
		(item.extensionKey === 'gadget'
			? (dataAndChartsPreviewImageUrlsByKey[`${item.extensionKey}:${normalizedTitle}`] ??
				otherPreviewImageUrlsByKey[`${item.extensionKey}:${normalizedTitle}`])
			: undefined) ??
		(item.extensionKey ? dataAndChartsPreviewImageUrlsByKey[item.extensionKey] : undefined)
	);
};
