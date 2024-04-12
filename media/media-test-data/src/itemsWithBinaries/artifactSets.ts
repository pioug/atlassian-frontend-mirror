import { sampleBinaries } from './sampleBinaries';
import { ArtifactsSets } from './types';

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
  mp3Sonata: {
    binaryUri: sampleBinaries.mp3Sonata,
    // Any audio* artifact
    audio: sampleBinaries.mp3Sonata,
  },
};

export const defaultArtifactsUris: ArtifactsSets = {
  video: artifactSets.videoFire,
  image: artifactSets.jpgCat,
  doc: artifactSets.pdfAnatomy,
  audio: artifactSets.mp3Sonata,
};
