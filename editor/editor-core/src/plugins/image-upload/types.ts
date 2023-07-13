import { ImageUploadPluginReferenceEvent } from '@atlaskit/editor-common/types';

export type {
  InsertedImageProperties,
  ImageUploadProvider as ImageUploadHandler,
} from '@atlaskit/editor-common/provider-factory';

export type ImageUploadPluginAction = {
  name: 'START_UPLOAD';
  event?: ImageUploadPluginReferenceEvent;
};

export type ImageUploadPluginState = {
  active: boolean;
  enabled: boolean;
  hidden: boolean;
  activeUpload?: {
    event?: ImageUploadPluginReferenceEvent;
  };
};
