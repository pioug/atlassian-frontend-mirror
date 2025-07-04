const jpgCatPreview = () =>
	import(/* webpackChunkName: "@atlaskit-internal_jpgCatPreview" */ './jpgCatPreview').then(
		(mod) => mod.default,
	);

const mp3Sonata = () =>
	import(/* webpackChunkName: "@atlaskit-internal_mp3Sonata" */ './mp3Sonata').then(
		(mod) => mod.default,
	);

const passwordPdf = () =>
	import(/* webpackChunkName: "@atlaskit-internal_passwordPdf" */ './passwordPdf').then(
		(mod) => mod.default,
	);

const pdfAnatomy = () =>
	import(/* webpackChunkName: "@atlaskit-internal_pdfAnatomy" */ './pdfAnatomy').then(
		(mod) => mod.default,
	);

const pdfAnatomyPreview = () =>
	import(/* webpackChunkName: "@atlaskit-internal_pdfAnatomyPreview" */ './pdfAnatomyPreview').then(
		(mod) => mod.default,
	);

const jpgRotated = () =>
	import(/* webpackChunkName: "@atlaskit-internal_rotatedImages" */ './rotatedImages').then(
		(mod) => mod.default,
	);

const svgCar = () =>
	import(/* webpackChunkName: "@atlaskit-internal_svgCar" */ './svgCar').then((mod) => mod.default);

const svgCarPreview = () =>
	import(/* webpackChunkName: "@atlaskit-internal_svgCarPreview" */ './svgCarPreview').then(
		(mod) => mod.default,
	);

const svgOpenWeb = () =>
	import(/* webpackChunkName: "@atlaskit-internal_svgOpenWeb" */ './svgOpenWeb').then(
		(mod) => mod.default,
	);

const svgOpenWebPreview = () =>
	import(/* webpackChunkName: "@atlaskit-internal_svgOpenWebPreview" */ './svgOpenWebPreview').then(
		(mod) => mod.default,
	);

const svgAjDigitalCamera = () =>
	import(
		/* webpackChunkName: "@atlaskit-internal_svgAjDigitalCamera" */ './svgAjDigitalCamera'
	).then((mod) => mod.default);

const svgAjDigitalCameraCorrupted = () =>
	import(
		/* webpackChunkName: "@atlaskit-internal_svgAjDigitalCameraCorrupted" */ './svgAjDigitalCameraCorrupted'
	).then((mod) => mod.default);

const svgAjDigitalCameraPreview = () =>
	import(
		/* webpackChunkName: "@atlaskit-internal_svgAjDigitalCameraPreview" */ './svgAjDigitalCameraPreview'
	).then((mod) => mod.default);

const svgAtom = () =>
	import(/* webpackChunkName: "@atlaskit-internal_svgAtom" */ './svgAtom').then(
		(mod) => mod.default,
	);

const svgAtomPreview = () =>
	import(/* webpackChunkName: "@atlaskit-internal_svgAtomPreview" */ './svgAtomPreview').then(
		(mod) => mod.default,
	);

const videoFire1080p = () =>
	import(/* webpackChunkName: "@atlaskit-internal_videoFire1080p" */ './videoFire1080p').then(
		(mod) => mod.default,
	);

const videoFirePreview = () =>
	import(/* webpackChunkName: "@atlaskit-internal_videoFirePreview" */ './videoFirePreview').then(
		(mod) => mod.default,
	);

const videoTeacup720p = () =>
	import(/* webpackChunkName: "@atlaskit-internal_videoTeacup720p" */ './videoTeacup720p').then(
		(mod) => mod.default,
	);

const videoTeacupPreview = () =>
	import(
		/* webpackChunkName: "@atlaskit-internal_videoTeacupPreview" */ './videoTeacupPreview'
	).then((mod) => mod.default);

const videoWithCaptions = () =>
	import(/* webpackChunkName: "@atlaskit-internal_videoCaptions" */ './videoWithCaptions').then(
		(mod) => mod.default,
	);

const videoWithCaptionsPreview = () =>
	import(
		/* webpackChunkName: "@atlaskit-internal_videoCaptionsPreview" */ './videoWithCaptionsPreview'
	).then((mod) => mod.default);

const videoCaptionsEn = () =>
	import(
		/* webpackChunkName: "@atlaskit-internal_videoCaptionsCaptions" */ './videoCaptionsEn'
	).then((mod) => mod.default);

const videoCaptionsEnCorrupted = () =>
	import(
		/* webpackChunkName: "@atlaskit-internal_videoCaptionsCaptionsEnCorrupted" */ './videoCaptionsEnCorrupted'
	).then((mod) => mod.default);

const videoCaptionsEs = () =>
	import(
		/* webpackChunkName: "@atlaskit-internal_videoCaptionsCaptionsEs" */ './videoCaptionsEs'
	).then((mod) => mod.default);

const videoCaptionsFr = () =>
	import(
		/* webpackChunkName: "@atlaskit-internal_videoCaptionsCaptionsFr" */ './videoCaptionsFr'
	).then((mod) => mod.default);

const videoCaptionsZh = () =>
	import(
		/* webpackChunkName: "@atlaskit-internal_videoCaptionsCaptionsZh" */ './videoCaptionsZh'
	).then((mod) => mod.default);

const jpgCat = () =>
	import(/* webpackChunkName: "@atlaskit-internal_jpgCat" */ './jpgCat').then((mod) => mod.default);

export const sampleBinaries = {
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
