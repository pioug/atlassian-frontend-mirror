const jpgCatPreview = () =>
  import(
    /* webpackChunkName: "@atlaskit-internal_jpgCatPreview" */ './jpgCatPreview'
  ).then(mod => mod.default);

const mp3Sonata = () =>
  import(
    /* webpackChunkName: "@atlaskit-internal_mp3Sonata" */ './mp3Sonata'
  ).then(mod => mod.default);

const passwordPdf = () =>
  import(
    /* webpackChunkName: "@atlaskit-internal_passwordPdf" */ './passwordPdf'
  ).then(mod => mod.default);

const pdfAnatomy = () =>
  import(
    /* webpackChunkName: "@atlaskit-internal_pdfAnatomy" */ './pdfAnatomy'
  ).then(mod => mod.default);

const pdfAnatomyPreview = () =>
  import(
    /* webpackChunkName: "@atlaskit-internal_pdfAnatomyPreview" */ './pdfAnatomyPreview'
  ).then(mod => mod.default);

const jpgRotated = () =>
  import(
    /* webpackChunkName: "@atlaskit-internal_rotatedImages" */ './rotatedImages'
  ).then(mod => mod.default);

const videoFire1080p = () =>
  import(
    /* webpackChunkName: "@atlaskit-internal_videoFire1080p" */ './videoFire1080p'
  ).then(mod => mod.default);

const videoFirePreview = () =>
  import(
    /* webpackChunkName: "@atlaskit-internal_videoFirePreview" */ './videoFirePreview'
  ).then(mod => mod.default);

const videoTeacup720p = () =>
  import(
    /* webpackChunkName: "@atlaskit-internal_videoTeacup720p" */ './videoTeacup720p'
  ).then(mod => mod.default);

const videoTeacupPreview = () =>
  import(
    /* webpackChunkName: "@atlaskit-internal_videoTeacupPreview" */ './videoTeacupPreview'
  ).then(mod => mod.default);

const jpgCat = () =>
  import(/* webpackChunkName: "@atlaskit-internal_jpgCat" */ './jpgCat').then(
    mod => mod.default,
  );

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
};
