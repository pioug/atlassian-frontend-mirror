import { FileItemGenerator, generateSampleFileItem } from '../sampleFileItems';

import { artifactSets } from './artifactSets';
import { createItemWithBinaries } from './createItemWithBinaries';
import { GeneratedItemWithBinaries } from './types';

interface ItemWithBinariesGenerator {
  (): GeneratedItemWithBinaries;
}

const createItemWithBinariesGenerator =
  (
    fileItemGenerator: FileItemGenerator,
    artifactsUri: Record<string, string>,
  ): ItemWithBinariesGenerator =>
  () => {
    const [fileItem, identifier] = fileItemGenerator();
    const itemWithBinaries = createItemWithBinaries(fileItem, artifactsUri);
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
    artifactSets.pdfAnatomy,
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
  // workingArchive,
  // workingUnknown,
  // workingGif,
  // failedPdf,
  // processingPdf,
  // failedVideo,
};
