import {
  ErrorFileState,
  FileState,
  UploadingFileState,
} from '@atlaskit/media-client';
import { CardStatus, CardState } from '../../..';
import {
  createStateUpdater,
  getCardStateFromFileState,
} from '../../card/cardState';
import * as getCardStatusModule from '../../card/getCardStatus';
import * as filePreviewStatusModule from '../../card/getCardPreview/filePreviewStatus';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import { MediaCardError } from '../../../errors';
import { FilePreviewStatus } from '../../../types';

const extractFilePreviewStatus = jest
  .spyOn(filePreviewStatusModule, 'extractFilePreviewStatus')
  .mockReturnValue(({
    some: 'file-preview-status',
  } as unknown) as FilePreviewStatus);

const isFinalCardStatus = jest
  .spyOn(getCardStatusModule, 'isFinalCardStatus')
  .mockImplementation((status: string) => {
    // We mock the non-final statuses to not having
    // to go through all of them on our tests
    switch (status) {
      case 'final':
      case 'failed-processing':
      case 'complete':
      case 'error':
        return true;
      default:
        return false;
    }
  });

const getCardStatus = jest
  .spyOn(getCardStatusModule, 'getCardStatus')
  .mockReturnValue('some-card-status' as CardStatus);

describe('createStateUpdater', () => {
  const nonFinalStatus = 'non-final' as CardStatus;
  const finalStatus = 'final' as CardStatus;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    [nonFinalStatus, finalStatus],
    ['error', 'complete'],
    ['failed-processing', 'complete'],
  ])(
    'should extend previous card state with new card state if the old status is %s and the new status is %s',
    (prevStatus, nextStatus) => {
      const newCardState = { status: nextStatus } as CardState;
      const prevCardState = { status: prevStatus } as CardState;

      const updater = createStateUpdater(newCardState);

      expect(updater(prevCardState)).toEqual(
        expect.objectContaining({
          ...prevCardState,
          ...newCardState,
        }),
      );
      expect(isFinalCardStatus).toBeCalledTimes(1);
    },
  );

  it.each([
    [finalStatus, nonFinalStatus],
    ['complete', 'error'],
    ['complete', 'failed-processing'],
  ])(
    'should return previous card state if the old status is %s and the new status is %s',
    (prevStatus, nextStatus) => {
      const newCardState = { status: nextStatus } as CardState;
      const prevCardState = { status: prevStatus } as CardState;

      const updater = createStateUpdater(newCardState);

      expect(updater(prevCardState)).toBe(prevCardState);
      expect(isFinalCardStatus).toBeCalledTimes(1);
    },
  );
});

describe('getCardStateFromFileState', () => {
  beforeEach(() => {
    (getCardStatus as jest.Mock).mockClear();
    (extractFilePreviewStatus as jest.Mock).mockClear();
  });

  it('should return state containing the file state plus the resulting card status', () => {
    const fileState = ({
      some: 'file-state',
      status: 'some-status',
    } as unknown) as FileState;
    const featureFlags = { some: 'feature-flags' } as MediaFeatureFlags;
    const cardState = getCardStateFromFileState(fileState, false, featureFlags);
    expect(cardState).toEqual(
      expect.objectContaining({
        fileState,
        status: 'some-card-status',
      }),
    );
    expect(getCardStatus).toBeCalledTimes(1);
    expect(getCardStatus).toBeCalledWith(
      'some-status',
      expect.objectContaining({ some: 'file-preview-status' }),
    );
    expect(extractFilePreviewStatus).toBeCalledTimes(1);
    expect(extractFilePreviewStatus).toBeCalledWith(
      fileState,
      false,
      featureFlags,
    );
  });

  it('should return state containing Media Card error if the file state is ErrorFilestate', () => {
    (getCardStatus as jest.Mock).mockReturnValueOnce('error');
    const fileState: ErrorFileState = {
      status: 'error',
      id: 'some-id',
      message: 'some-message',
    };
    const featureFlags = { some: 'feature-flags' } as MediaFeatureFlags;
    const cardState = getCardStateFromFileState(fileState, false, featureFlags);
    expect(cardState).toEqual(
      expect.objectContaining({
        fileState,
        status: 'error',
        error: expect.any(MediaCardError),
      }),
    );
    expect(getCardStatus).toBeCalledTimes(1);
    expect(getCardStatus).toBeCalledWith(
      'error',
      expect.objectContaining({ some: 'file-preview-status' }),
    );
    expect(extractFilePreviewStatus).toBeCalledTimes(1);
    expect(extractFilePreviewStatus).toBeCalledWith(
      fileState,
      false,
      featureFlags,
    );
  });

  it('should return state containing upload progress if the file state is UploadingFileState', () => {
    (getCardStatus as jest.Mock).mockReturnValueOnce('uploading');
    const fileState: UploadingFileState = {
      status: 'uploading',
      id: 'some-id',
      name: 'some-name',
      size: 1234,
      progress: 0.5,
      mediaType: 'image',
      mimeType: 'some-mimeType',
    };
    const featureFlags = { some: 'feature-flags' } as MediaFeatureFlags;
    const cardState = getCardStateFromFileState(fileState, false, featureFlags);
    expect(cardState).toEqual(
      expect.objectContaining({
        fileState,
        status: 'uploading',
        progress: 0.5,
      }),
    );
    expect(getCardStatus).toBeCalledTimes(1);
    expect(getCardStatus).toBeCalledWith(
      'uploading',
      expect.objectContaining({ some: 'file-preview-status' }),
    );
    expect(extractFilePreviewStatus).toBeCalledTimes(1);
    expect(extractFilePreviewStatus).toBeCalledWith(
      fileState,
      false,
      featureFlags,
    );
  });
});
