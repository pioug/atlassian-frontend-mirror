export type {
  InsertedImageProperties,
  ImageUploadProvider as ImageUploadHandler,
} from '@atlaskit/editor-common/provider-factory';

export type ImageUploadPluginAction = {
  name: 'START_UPLOAD';
  event?: Event;
};

export type ImageUploadPluginState = {
  active: boolean;
  enabled: boolean;
  hidden: boolean;
  activeUpload?: {
    event?: Event;
  };
};
