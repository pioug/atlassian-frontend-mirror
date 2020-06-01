export { downloadUrl } from './downloadUrl';
// Warning! You can't add new media types!
// See packages/media/media-core/src/__tests__/cache-backward-compatibility.spec.ts
export type MediaType = 'doc' | 'audio' | 'video' | 'image' | 'unknown';
