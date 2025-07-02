import { sampleBinaries } from './sampleBinaries';
import { type ArtifactsSets } from './types';

export const artifactSets: ArtifactsSets = {
	jpgCat: {
		binaryUri: sampleBinaries.jpgCat,
		// preview & any image* artifact
		image: sampleBinaries.jpgCatPreview,
	},
	pdfAnatomy: {
		binaryUri: sampleBinaries.pdfAnatomy,
		image: sampleBinaries.pdfAnatomyPreview,
		// Any document* artifact
		document: sampleBinaries.pdfAnatomy,
	},
	pdfAnatomyNoPreview: {
		binaryUri: sampleBinaries.pdfAnatomy,
		// Any document* artifact
		document: sampleBinaries.pdfAnatomy,
	},
	passwordPdf: {
		binaryUri: sampleBinaries.passwordPdf,
		image: sampleBinaries.pdfAnatomyPreview,
		// Any document* artifact
		document: sampleBinaries.passwordPdf,
	},
	videoTeacup: {
		binaryUri: sampleBinaries.videoTeacup720p,
		image: sampleBinaries.videoTeacupPreview,
		// "video_hd.mp4" artifact
		'video_hd.mp4': sampleBinaries.videoTeacup720p,
		// Any poster* artifact
		poster: sampleBinaries.videoTeacupPreview,
		// Any thumb* artifact
		thumb: sampleBinaries.videoTeacupPreview,
		// Any video* artifact
		video: sampleBinaries.videoTeacup720p,
	},
	videoFire: {
		binaryUri: sampleBinaries.videoFire1080p,
		image: sampleBinaries.videoFirePreview,
		video: sampleBinaries.videoFire1080p,
	},
	videoCaptions: {
		binaryUri: sampleBinaries.videoWithCaptions,
		image: sampleBinaries.videoWithCaptionsPreview,
		video: sampleBinaries.videoWithCaptions,
		// Should match with the specific caption key in the file item
		ugc_caption_1111: sampleBinaries.videoCaptionsEn,
		ugc_caption_2222: sampleBinaries.videoCaptionsEs,
		ugc_caption_3333: sampleBinaries.videoCaptionsFr,
		ugc_caption_4444: sampleBinaries.videoCaptionsZh,
		ugc_caption_CORRUPTED: sampleBinaries.videoCaptionsEnCorrupted,
	},
	mp3Sonata: {
		binaryUri: sampleBinaries.mp3Sonata,
		// Any audio* artifact
		audio: sampleBinaries.mp3Sonata,
	},
	svgCar: {
		binaryUri: sampleBinaries.svgCar,
		// preview & any image* artifact
		image: sampleBinaries.svgCarPreview,
	},
	svgOpenWeb: {
		binaryUri: sampleBinaries.svgOpenWeb,
		// preview & any image* artifact
		image: sampleBinaries.svgOpenWebPreview,
	},
	svgAjDigitalCamera: {
		binaryUri: sampleBinaries.svgAjDigitalCamera,
		// preview & any image* artifact
		image: sampleBinaries.svgAjDigitalCameraPreview,
	},
	svgAjDigitalCameraCorrupted: {
		binaryUri: sampleBinaries.svgAjDigitalCameraCorrupted,
		// preview & any image* artifact
		image: sampleBinaries.svgAjDigitalCameraPreview,
	},
	svgAtom: {
		binaryUri: sampleBinaries.svgAtom,
		// preview & any image* artifact
		image: sampleBinaries.svgAtomPreview,
	},
};

export const defaultArtifactsUris: ArtifactsSets = {
	video: artifactSets.videoFire,
	image: artifactSets.jpgCat,
	doc: artifactSets.pdfAnatomy,
	audio: artifactSets.mp3Sonata,
};
