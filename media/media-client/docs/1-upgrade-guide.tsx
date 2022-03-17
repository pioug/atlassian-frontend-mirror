import { code, md } from '@atlaskit/docs';

export default md`
  # 14.x - 15.x

  ## API Changes

  #### MediaSubscribable

  Media Client API has been updated to use MediaSubscribable which provides subscription functionality (similar to RxJs observables).
  It exposes subscribe method that is called with MediaObserver as an argument and returns MediaSubscription.
  MediaSubscription exposes unsubscribe method.

  #### getFileState

  The returned type of this function has changed from RxJs ReplaySubject to MediaSubscribable.

  ### Usage:

  ${code`
  import { MediaClient, MediaObserver, MediaSubscribable, MediaSubscription } from '@atlaskit/media-client';

  const mediaClient = new MediaClient({ authProvider });

  const fileStateSubscribable: MediaSubscribable<FileState> = mediaClient.file.getFileState(id);

  const mediaObserver: MediaObserver<FileState> = {
    next: (fileState) => {
      nextCallback(fileState)
    },
    error: (error) => {
      errorCallback(error)
    },
  };

  const subscription: MediaSubscription = fileStateSubscribable.subscribe(mediaObserver);

  subscription.unsubscribe();
  `}

  #### upload

  The returned type of this function has changed from RxJs ReplaySubject to MediaSubscribable.

  ### Usage:

  ${code`
  import { MediaClient, MediaObserver, MediaSubscribable, MediaSubscription } from '@atlaskit/media-client';

  const mediaClient = new MediaClient({ authProvider });

  const uploadFileSubscribable: MediaSubscribable<FileState> = mediaClient.file.upload(uploadableFile);

  const mediaObserver: MediaObserver<FileState> = {
    next: (fileState) => {
      nextCallback(fileState)
    },
    error: (error) => {
      errorCallback(error)
    },
  };

  const subscription: MediaSubscription = uploadFileSubscribable.subscribe(mediaObserver);

  subscription.unsubscribe();
  `}

  #### getItems

  The returned type of this function has changed from RxJs ReplaySubject to MediaSubscribable.

  ### Usage:

  ${code`
  import { MediaClient, MediaObserver, MediaSubscribable, MediaSubscription } from '@atlaskit/media-client';

  const mediaClient = new MediaClient({ authProvider });

  const collectionItemsSubscribable: MediaSubscribable<MediaCollectionItem[]> = mediaClient.collection.getItems(collectionName);

  const mediaObserver: MediaObserver<MediaCollectionItem[]> = {
    next: (items) => {
      nextCallback(items)
    },
    error: (error) => {
      errorCallback(error)
    },
  };

  const subscription: MediaSubscription = collectionItemsSubscribable.subscribe(mediaObserver);

  subscription.unsubscribe();
  `}

`;
