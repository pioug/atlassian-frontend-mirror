import {
  type FileItemGenerator,
  generateSampleFileItem,
} from '../sampleFileItems';

import { artifactSets } from './artifactSets';
import { createItemWithBinaries } from './createItemWithBinaries';
import { type ArtifactsSet, type ItemWithBinariesGenerator } from './types';

const createItemWithBinariesGenerator =
  (
    fileItemGenerator: FileItemGenerator,
    artifactsSet: ArtifactsSet,
  ): ItemWithBinariesGenerator =>
  async () => {
    const [fileItem, identifier] = fileItemGenerator();
    const itemWithBinaries = await createItemWithBinaries(
      fileItem,
      artifactsSet,
    );
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

const svg = {
  svgCar: createItemWithBinariesGenerator(
    generateSampleFileItem.svg,
    artifactSets.svgCar,
  ),
  svgOpenWeb: createItemWithBinariesGenerator(
    generateSampleFileItem.svg,
    artifactSets.svgOpenWeb,
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
  // workingArchive,
  // workingUnknown,
  // workingGif,
  // failedPdf,
  // processingPdf,
  // failedVideo,
};
