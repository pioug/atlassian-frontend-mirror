export type ImageUploadPluginReferenceEventBase = {
  type: 'drop' | 'paste';
};

export type ImageUploadPluginReferenceEventDragEvent =
  ImageUploadPluginReferenceEventBase & {
    dataTransfer?: DataTransfer;
  };

export type ImageUploadPluginReferenceEventClipboardEvent =
  ImageUploadPluginReferenceEventBase & {
    clipboardData?: DataTransfer;
  };

export type ImageUploadPluginReferenceEvent =
  | ImageUploadPluginReferenceEventDragEvent
  | ImageUploadPluginReferenceEventClipboardEvent;
