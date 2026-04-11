const jpgCatPreview = (): Promise<string> =>
	import(/* webpackChunkName: "@atlaskit-internal_jpgCatPreview" */ './jpgCatPreview').then(
		(mod) => mod.default,
	);

const mp3Sonata = (): Promise<string> =>
	import(/* webpackChunkName: "@atlaskit-internal_mp3Sonata" */ './mp3Sonata').then(
		(mod) => mod.default,
	);

const passwordPdf = (): Promise<string> =>
	import(/* webpackChunkName: "@atlaskit-internal_passwordPdf" */ './passwordPdf').then(
		(mod) => mod.default,
	);

const pdfAnatomy = (): Promise<string> =>
	import(/* webpackChunkName: "@atlaskit-internal_pdfAnatomy" */ './pdfAnatomy').then(
		(mod) => mod.default,
	);

const pdfAnatomyPreview = (): Promise<string> =>
	import(/* webpackChunkName: "@atlaskit-internal_pdfAnatomyPreview" */ './pdfAnatomyPreview').then(
		(mod) => mod.default,
	);

const jpgRotated = (): Promise<{
	landscape0: string;
	landscape1: string;
	landscape2: string;
	landscape3: string;
	landscape4: string;
	landscape5: string;
	landscape6: string;
	landscape7: string;
	landscape8: string;
}> =>
	import(/* webpackChunkName: "@atlaskit-internal_rotatedImages" */ './rotatedImages').then(
		(mod) => mod.default,
	);

const svgCar = (): Promise<string> =>
	import(/* webpackChunkName: "@atlaskit-internal_svgCar" */ './svgCar').then((mod) => mod.default);

const svgCarPreview = (): Promise<string> =>
	import(/* webpackChunkName: "@atlaskit-internal_svgCarPreview" */ './svgCarPreview').then(
		(mod) => mod.default,
	);

const svgOpenWeb = (): Promise<string> =>
	import(/* webpackChunkName: "@atlaskit-internal_svgOpenWeb" */ './svgOpenWeb').then(
		(mod) => mod.default,
	);

const svgOpenWebPreview = (): Promise<string> =>
	import(/* webpackChunkName: "@atlaskit-internal_svgOpenWebPreview" */ './svgOpenWebPreview').then(
		(mod) => mod.default,
	);

const svgAjDigitalCamera = (): Promise<string> =>
	import(
		/* webpackChunkName: "@atlaskit-internal_svgAjDigitalCamera" */ './svgAjDigitalCamera'
	).then((mod) => mod.default);

const svgAjDigitalCameraCorrupted = (): Promise<string> =>
	import(
		/* webpackChunkName: "@atlaskit-internal_svgAjDigitalCameraCorrupted" */ './svgAjDigitalCameraCorrupted'
	).then((mod) => mod.default);

const svgAjDigitalCameraPreview = (): Promise<string> =>
	import(
		/* webpackChunkName: "@atlaskit-internal_svgAjDigitalCameraPreview" */ './svgAjDigitalCameraPreview'
	).then((mod) => mod.default);

const svgAtom = (): Promise<string> =>
	import(/* webpackChunkName: "@atlaskit-internal_svgAtom" */ './svgAtom').then(
		(mod) => mod.default,
	);

const svgAtomPreview = (): Promise<string> =>
	import(/* webpackChunkName: "@atlaskit-internal_svgAtomPreview" */ './svgAtomPreview').then(
		(mod) => mod.default,
	);

const videoFire1080p = (): Promise<string> =>
	import(/* webpackChunkName: "@atlaskit-internal_videoFire1080p" */ './videoFire1080p').then(
		(mod) => mod.default,
	);

const videoFirePreview = (): Promise<string> =>
	import(/* webpackChunkName: "@atlaskit-internal_videoFirePreview" */ './videoFirePreview').then(
		(mod) => mod.default,
	);

const videoTeacup720p = (): Promise<string> =>
	import(/* webpackChunkName: "@atlaskit-internal_videoTeacup720p" */ './videoTeacup720p').then(
		(mod) => mod.default,
	);

const videoTeacupPreview = (): Promise<string> =>
	import(
		/* webpackChunkName: "@atlaskit-internal_videoTeacupPreview" */ './videoTeacupPreview'
	).then((mod) => mod.default);

const videoWithCaptions = (): Promise<string> =>
	import(/* webpackChunkName: "@atlaskit-internal_videoCaptions" */ './videoWithCaptions').then(
		(mod) => mod.default,
	);

const videoWithCaptionsPreview = (): Promise<string> =>
	import(
		/* webpackChunkName: "@atlaskit-internal_videoCaptionsPreview" */ './videoWithCaptionsPreview'
	).then((mod) => mod.default);

const videoCaptionsEn = (): Promise<string> =>
	import(
		/* webpackChunkName: "@atlaskit-internal_videoCaptionsCaptions" */ './videoCaptionsEn'
	).then((mod) => mod.default);

const videoCaptionsEnCorrupted = (): Promise<string> =>
	import(
		/* webpackChunkName: "@atlaskit-internal_videoCaptionsCaptionsEnCorrupted" */ './videoCaptionsEnCorrupted'
	).then((mod) => mod.default);

const videoCaptionsEs = (): Promise<string> =>
	import(
		/* webpackChunkName: "@atlaskit-internal_videoCaptionsCaptionsEs" */ './videoCaptionsEs'
	).then((mod) => mod.default);

const videoCaptionsFr = (): Promise<string> =>
	import(
		/* webpackChunkName: "@atlaskit-internal_videoCaptionsCaptionsFr" */ './videoCaptionsFr'
	).then((mod) => mod.default);

const videoCaptionsZh = (): Promise<string> =>
	import(
		/* webpackChunkName: "@atlaskit-internal_videoCaptionsCaptionsZh" */ './videoCaptionsZh'
	).then((mod) => mod.default);

const jpgCat = (): Promise<string> =>
	import(/* webpackChunkName: "@atlaskit-internal_jpgCat" */ './jpgCat').then((mod) => mod.default);

export const sampleBinaries: {
	jpgCat: () => Promise<string>;
	jpgCatPreview: () => Promise<string>;
	jpgRotated: () => Promise<{
		landscape0: string;
		landscape1: string;
		landscape2: string;
		landscape3: string;
		landscape4: string;
		landscape5: string;
		landscape6: string;
		landscape7: string;
		landscape8: string;
	}>;
	videoTeacup720p: () => Promise<string>;
	videoTeacupPreview: () => Promise<string>;
	videoFire1080p: () => Promise<string>;
	videoFirePreview: () => Promise<string>;
	pdfAnatomy: () => Promise<string>;
	pdfAnatomyPreview: () => Promise<string>;
	mp3Sonata: () => Promise<string>;
	passwordPdf: () => Promise<string>;
	svgCar: () => Promise<string>;
	svgCarPreview: () => Promise<string>;
	svgOpenWeb: () => Promise<string>;
	svgOpenWebPreview: () => Promise<string>;
	svgAjDigitalCamera: () => Promise<string>;
	svgAjDigitalCameraCorrupted: () => Promise<string>;
	svgAjDigitalCameraPreview: () => Promise<string>;
	svgAtom: () => Promise<string>;
	svgAtomPreview: () => Promise<string>;
	videoWithCaptions: () => Promise<string>;
	videoWithCaptionsPreview: () => Promise<string>;
	videoCaptionsEn: () => Promise<string>;
	videoCaptionsEs: () => Promise<string>;
	videoCaptionsFr: () => Promise<string>;
	videoCaptionsZh: () => Promise<string>;
	videoCaptionsEnCorrupted: () => Promise<string>;
} = {
	jpgCat,
	jpgCatPreview,
	jpgRotated,
	videoTeacup720p,
	videoTeacupPreview,
	videoFire1080p,
	videoFirePreview,
	pdfAnatomy,
	pdfAnatomyPreview,
	mp3Sonata,
	passwordPdf,
	svgCar,
	svgCarPreview,
	svgOpenWeb,
	svgOpenWebPreview,
	svgAjDigitalCamera,
	svgAjDigitalCameraCorrupted,
	svgAjDigitalCameraPreview,
	svgAtom,
	svgAtomPreview,
	videoWithCaptions,
	videoWithCaptionsPreview,
	videoCaptionsEn,
	videoCaptionsEs,
	videoCaptionsFr,
	videoCaptionsZh,
	videoCaptionsEnCorrupted,
};
