import { ProductKeys } from './types';

const productKeys: ProductKeys = {
  confluence: {
    newCardExperience: 'confluence.frontend.media.cards.new.experience',
    captions: 'confluence.frontend.fabric.editor.media.captions',
    mediaInline: 'confluence.frontend.fabric.editor.media.inline',
    folderUploads: 'confluence.frontend.media.picker.folder.uploads',
    //TODO fill the value after https://product-fabric.atlassian.net/browse/MEX-1593
    observedWidth: '',
    timestampOnVideo: 'confluence.frontend.media.timestamp.on.video',
    memoryCacheLogging: 'confluence-frontend-media-card-memory-cache-logging',
    fetchFileStateAfterUpload:
      'confluence-frontend-media-client-fetch-file-state-after-upload',
  },
  jira: {
    newCardExperience: 'issue.details.media-cards-new-experience',
    captions: 'issue.details.editor.media.captions',
    // Manged by Linking Platform. No Rollout plan found for Jira
    mediaInline: '',
    folderUploads: 'issue.details.media-picker-folder-upload',
    //TODO fill the value after https://product-fabric.atlassian.net/browse/MEX-1593
    observedWidth: '',
    timestampOnVideo: 'issue.details.media-cards-timestamp-on-video',
    memoryCacheLogging: 'jira-frontend-media-card-memory-cache-logging',
    fetchFileStateAfterUpload:
      'jira-frontend-media-client-fetch-file-state-after-upload',
  },
};

export const getProductKeys = () => productKeys;
