import { Fragment } from 'prosemirror-model';

export interface Serializer<T> {
  serializeFragment(
    fragment: Fragment,
    props?: any,
    target?: any,
    key?: string,
  ): T | null;
}

export type MediaImageBase64 = {
  contentId: string;
  contentType: string;
  data: string;
};

export interface SerializeFragmentWithAttachmentsResult {
  result: string | null;
  embeddedImages: MediaImageBase64[];
}

export interface SerializerWithImages<T> extends Serializer<T> {
  serializeFragmentWithImages(
    fragment: Fragment,
    props?: any,
    target?: any,
    key?: string,
  ): SerializeFragmentWithAttachmentsResult | null;
}
