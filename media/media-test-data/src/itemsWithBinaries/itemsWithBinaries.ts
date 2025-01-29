import { merge, type PartialResponseFileItem } from '@atlaskit/media-client/test-helpers';

import { type FileItemGenerator, generateSampleFileItem } from '../sampleFileItems';

import { artifactSets } from './artifactSets';
import { createItemWithBinaries } from './createItemWithBinaries';
import { type ArtifactsSet, type ItemWithBinariesGenerator } from './types';

const createItemWithBinariesGenerator =
	(
		fileItemGenerator: FileItemGenerator,
		artifactsSet: ArtifactsSet,
		override?: PartialResponseFileItem,
	): ItemWithBinariesGenerator =>
	async (overrideItem) => {
		const [fileItem, identifier] = fileItemGenerator(merge(override, overrideItem));
		const itemWithBinaries = await createItemWithBinaries(fileItem, artifactsSet);
		return [itemWithBinaries, identifier];
	};

const workingImgWithRemotePreview = {
	jpgCat: createItemWithBinariesGenerator(
		generateSampleFileItem.workingImgWithRemotePreview,
		artifactSets.jpgCat,
	),
};

const workingJpegWithRemotePreview = {
	jpgCat: createItemWithBinariesGenerator(
		generateSampleFileItem.workingJpegWithRemotePreview,
		artifactSets.jpgCat,
	),
};

const workingImgWithRemotePreviewInRecentsCollection = {
	jpgCat: createItemWithBinariesGenerator(
		generateSampleFileItem.workingImgWithRemotePreviewInRecentsCollection,
		artifactSets.jpgCat,
	),
};

const workingPdfWithRemotePreview = {
	pdfAnatomy: createItemWithBinariesGenerator(
		generateSampleFileItem.workingPdfWithRemotePreview,
		artifactSets.pdfAnatomy,
	),
};

const workingPdfWithoutRemotePreview = {
	pdfAnatomy: createItemWithBinariesGenerator(
		generateSampleFileItem.workingPdfWithoutRemotePreview,
		artifactSets.pdfAnatomyNoPreview,
	),
};

const workingPdfWithLocalPreview = {
	pdfAnatomy: createItemWithBinariesGenerator(
		generateSampleFileItem.workingPdfWithLocalPreview,
		artifactSets.pdfAnatomy,
	),
};

const workingAudioWithoutRemotePreview = {
	mp3Sonata: createItemWithBinariesGenerator(
		generateSampleFileItem.workingAudioWithoutRemotePreview,
		artifactSets.mp3Sonata,
	),
};

const passwordPdf = {
	passwordPdf: createItemWithBinariesGenerator(
		generateSampleFileItem.passwordPdf,
		artifactSets.passwordPdf,
	),
};

const workingVideo = {
	videoTeacup: createItemWithBinariesGenerator(
		generateSampleFileItem.workingVideo,
		artifactSets.videoTeacup,
	),
	videoFire: createItemWithBinariesGenerator(
		generateSampleFileItem.workingVideo,
		artifactSets.videoFire,
	),
};

const svg = {
	svgCar: createItemWithBinariesGenerator(generateSampleFileItem.svg, artifactSets.svgCar),
	svgOpenWeb: createItemWithBinariesGenerator(generateSampleFileItem.svg, artifactSets.svgOpenWeb, {
		details: { name: 'OpenWeb.svg' },
	}),
	svgAjDigitalCamera: createItemWithBinariesGenerator(
		generateSampleFileItem.svg,
		artifactSets.svgAjDigitalCamera,
		{ details: { name: 'ajDigitalCamera.svg' } },
	),
	svgAtom: createItemWithBinariesGenerator(generateSampleFileItem.svg, artifactSets.svgAtom, {
		details: { name: 'atom.svg' },
	}),
	failedProcessing: createItemWithBinariesGenerator(
		generateSampleFileItem.svgFailedProcessing,
		artifactSets.svgAjDigitalCamera,
		{ details: { name: 'ajDigitalCamera-failed-processing.svg' } },
	),
	binaryCorrupted: createItemWithBinariesGenerator(
		generateSampleFileItem.svg,
		artifactSets.svgAjDigitalCameraCorrupted,
		{ details: { name: 'ajDigitalCamera-corrupted.svg' } },
	),
};

const abuse = {
	image: createItemWithBinariesGenerator(generateSampleFileItem.abuseImage, artifactSets.jpgCat),
	svg: createItemWithBinariesGenerator(
		generateSampleFileItem.abuseSvg,
		artifactSets.svgAjDigitalCameraCorrupted,
		{ details: { name: 'corrupted-binary.svg' } },
	),
	pdfNoPreview: createItemWithBinariesGenerator(
		generateSampleFileItem.abusePdfNoPreview,
		artifactSets.pdfAnatomyNoPreview,
	),
};

/* type GenerateItemWithBinaries = {
  [key in keyof typeof generateSampleFileItem]: Record<
    string,
    ItemWithBinariesGenerator
  >;
}; */

// TODO: enforce type GenerateItemWithBinaries
export const generateItemWithBinaries = {
	workingImgWithRemotePreview,
	workingImgWithRemotePreviewInRecentsCollection,
	workingJpegWithRemotePreview,
	workingPdfWithRemotePreview,
	workingPdfWithoutRemotePreview,
	workingPdfWithLocalPreview,
	workingVideo,
	workingAudioWithoutRemotePreview,
	passwordPdf,
	svg,
	abuse,
	// workingArchive,
	// workingUnknown,
	// workingGif,
	// failedPdf,
	// processingPdf,
	// failedVideo,
};
