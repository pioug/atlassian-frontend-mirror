import React from 'react';
jest.mock('../../../service/uploadServiceImpl');
import { Dropzone, DropzoneBase } from '../../dropzone/dropzone';
import { mount, ReactWrapper } from 'enzyme';
import { DropzoneDragEnterEventPayload } from '../../types';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { MEDIA_CONTEXT } from '@atlaskit/analytics-namespaced-context/MediaAnalyticsContext';
import {
  ANALYTICS_MEDIA_CHANNEL,
  MediaFeatureFlags,
} from '@atlaskit/media-common';
import { fakeMediaClient, asMockFunction } from '@atlaskit/media-test-helpers';
import { isWebkitSupported } from '@atlaskit/media-ui/browser';

async function asyncUpdateComponentTick(wrapper: ReactWrapper) {
  return new Promise<void>((tickFinished) => {
    process.nextTick(() => {
      wrapper.update();
      tickFinished();
    });
  });
}

type DataTransferItem = {
  kind: string;
  file: File[];
  webkitGetAsEntry: () => {};
};

jest.mock('flat-files', () => ({
  __esModule: true,
  getFilesFromItems: jest
    .fn()
    .mockImplementation((fileArr: DataTransferItem[]) => {
      const files = fileArr[1].file;
      return files;
    }),
  getFilesFromFileSystemEntries: jest
    .fn()
    .mockImplementation((files: File[]) => {
      return files;
    }),
}));

jest.mock('@atlaskit/media-ui/browser', () => ({
  __esModule: true,
  isWebkitSupported: jest.fn(),
}));

const files = [new File([], '')];

const createDragOverOrDropEvent = (
  eventName: 'dragover' | 'drop' | 'dragleave',
  type?: string,
  customFiles?: File[],
) => {
  const event = document.createEvent('Event') as any;
  event.initEvent(eventName, true, true);
  event.preventDefault = () => {};
  event.dataTransfer = {
    types: [type || 'Files'],
    effectAllowed: 'move',
    items: [
      {
        kind: 'file',
        file: customFiles || files,
        webkitGetAsEntry: () => {
          return { isDirectory: true };
        },
      },
      {
        kind: 'string',
        file: customFiles || files,
        webkitGetAsEntry: () => {
          return { isDirectory: false };
        },
      },
    ],
    files: customFiles || files,
  };
  return event;
};

const createDragOverEvent = (type?: string) => {
  return createDragOverOrDropEvent('dragover', type);
};

const createDragLeaveEvent = () => {
  return createDragOverOrDropEvent('dragleave');
};

const createDropEvent = (files?: File[]) => {
  return createDragOverOrDropEvent('drop', '', files);
};

const mediaClient = fakeMediaClient();

const container = document.createElement('div');

[
  {
    config: { container, uploadParams: {} },
    expectedContainer: container,
    defaultFeatureFlags: {
      folderUploads: false,
      newCardExperience: false,
    },
  },
  {
    config: { uploadParams: {} },
    expectedContainer: document.body,
    defaultFeatureFlags: {
      folderUploads: false,
      newCardExperience: false,
    },
  },
].forEach((data) => {
  describe(`Dropzone with config: ${JSON.stringify(data.config)}`, () => {
    let component: ReactWrapper;
    const { config, expectedContainer, defaultFeatureFlags } = data;
    beforeEach(() => {
      asMockFunction(isWebkitSupported).mockReset();
    });

    afterEach(() => {
      jest.clearAllMocks();
      if (component.exists()) {
        component.unmount();
      }
    });

    it('adds "dragover", "dragleave" and "drop" events to container', async () => {
      let addEventListenerSpy: jest.SpyInstance<any>;
      addEventListenerSpy = jest.spyOn(expectedContainer, 'addEventListener');

      component = mount(<Dropzone mediaClient={mediaClient} config={config} />); // Must mount after syping

      const events = addEventListenerSpy.mock.calls.map((args) => args[0]);
      expect(events).toContain('dragover');
      expect(events).toContain('dragleave');
      expect(events).toContain('drop');
    });

    it('removes "dragover", "dragleave" and "drop" events from container', async () => {
      const removeEventListenerSpy = jest.spyOn(
        expectedContainer,
        'removeEventListener',
      );

      component = mount(<Dropzone mediaClient={mediaClient} config={config} />); // Must mount after syping
      component.unmount();

      const events = removeEventListenerSpy.mock.calls.map((args) => args[0]);
      expect(events).toContain('dragover');
      expect(events).toContain('dragleave');
      expect(events).toContain('drop');
    });

    it('should emit drag-enter for drag over with type "Files" and contain files length', (done) => {
      component = mount(
        <Dropzone
          mediaClient={mediaClient}
          config={config}
          onDragEnter={(e: DropzoneDragEnterEventPayload) => {
            expect(e.length).toEqual(1);
            done();
          }}
        />,
      );

      expectedContainer.dispatchEvent(createDragOverEvent());
    });

    it('should not emit drag-enter for drag over with type "Not Files"', (done) => {
      component = mount(
        <Dropzone
          mediaClient={mediaClient}
          config={config}
          onDragEnter={() => {
            expect(
              done(new Error('drag-enter should not be emitted')),
            ).not.toThrowError();
          }}
        />,
      );
      expect(component).toBeDefined();
      expectedContainer.dispatchEvent(createDragOverEvent('Not Files'));
      done();
    });

    it('should emit drag-leave for dragleave event', async (done) => {
      component = mount(
        <Dropzone
          mediaClient={mediaClient}
          config={config}
          onDragLeave={() => {
            done();
          }}
        />,
      );
      expect(component).toBeDefined();
      expectedContainer.dispatchEvent(createDragOverEvent());
      expectedContainer.dispatchEvent(createDragLeaveEvent());
    });

    it('should not emit drag-leave for dragleave event if there was no dragover', () => {
      component = mount(
        <Dropzone
          mediaClient={mediaClient}
          config={config}
          onDragLeave={() => {
            throw new Error('drag-leave should not be emitted');
          }}
        />,
      );
      expect(component).toBeDefined();
      expectedContainer.dispatchEvent(createDragLeaveEvent());
    });

    it('should upload files when files are dropped', async () => {
      component = mount(
        <DropzoneBase mediaClient={mediaClient} config={config} />,
      );

      const componentInstance = component.instance() as any;
      componentInstance.uploadService.addFiles = jest.fn();

      expectedContainer.dispatchEvent(createDropEvent());

      expect(componentInstance.uploadService.addFiles).toHaveBeenCalledTimes(1);
      expect(componentInstance.uploadService.addFiles).toBeCalledWith(files);
    });

    it('should ensure non-supported browser fallback works (in the context of folder uploads)', async () => {
      component = mount(
        <DropzoneBase
          mediaClient={mediaClient}
          config={config}
          featureFlags={{ folderUploads: true }}
        />,
      );

      const componentInstance = component.instance() as any;
      componentInstance.uploadService.addFiles = jest.fn();
      componentInstance.onDrop = jest.fn();

      expectedContainer.dispatchEvent(createDropEvent());

      //non-supported browser or feature flag off option calls onDrop function
      expect(componentInstance.onDrop).toHaveBeenCalledTimes(1);
      expect(componentInstance.uploadService.addFiles).toHaveBeenCalledTimes(1);
      expect(componentInstance.uploadService.addFiles).toBeCalledWith(files);
    });

    it('should filter files uploaded against a blocked list (when folder uploading is enabled)', async () => {
      asMockFunction(isWebkitSupported).mockImplementationOnce(() => {
        return true;
      });

      component = mount(
        <DropzoneBase
          mediaClient={mediaClient}
          config={config}
          featureFlags={{ folderUploads: true }}
        />,
      );

      const unfilteredFiles: File[] = [
        new File([], '.DS_Store'),
        new File([], ''),
      ];
      const componentInstance = component.instance() as any;
      componentInstance.uploadService.addFiles = jest.fn();

      expectedContainer.dispatchEvent(createDropEvent(unfilteredFiles));

      await asyncUpdateComponentTick(component);

      expect(componentInstance.uploadService.addFiles).toHaveBeenCalledTimes(1);
      expect(componentInstance.uploadService.addFiles).toBeCalledWith(files);
    });

    it('should ensure fallback works if the feature flag for folders is not enabled', async () => {
      component = mount(
        <DropzoneBase
          mediaClient={mediaClient}
          config={config}
          featureFlags={{ folderUploads: false }}
        />,
      );

      const componentInstance = component.instance() as any;
      componentInstance.uploadService.addFiles = jest.fn();
      componentInstance.onDrop = jest.fn();

      expectedContainer.dispatchEvent(createDropEvent());

      //non-supported browser or feature flag off option calls onDrop function
      expect(componentInstance.onDrop).toHaveBeenCalledTimes(1);
      expect(componentInstance.uploadService.addFiles).toHaveBeenCalledTimes(1);
      expect(componentInstance.uploadService.addFiles).toBeCalledWith(files);
    });

    it('should provide a function to onCancelFn callback property and call uploadService.cancel', () => {
      const onCancelFnMock = jest.fn();
      component = mount(
        <DropzoneBase
          mediaClient={mediaClient}
          config={config}
          onCancelFn={onCancelFnMock}
        />,
      );
      const instance = component.instance() as DropzoneBase;
      expect(onCancelFnMock).toBeCalled();
      onCancelFnMock.mock.calls[0][0]();
      expect((instance as any).uploadService.cancel).toBeCalled();
    });

    it('should change event listeners when container changes', () => {
      const onCancelFnMock = jest.fn();
      const newContainer = document.createElement('DIV');

      const removeEventListenerSpyOverOldContainer = jest.spyOn(
        expectedContainer,
        'removeEventListener',
      );
      const addEventListenerSpyOverNewContainer = jest.spyOn(
        newContainer,
        'addEventListener',
      );

      component = mount(
        <Dropzone
          mediaClient={mediaClient}
          config={config}
          onCancelFn={onCancelFnMock}
        />,
      );

      // clear the calls on initial render
      removeEventListenerSpyOverOldContainer.mockClear();

      component.setProps({
        config: {
          container: newContainer,
        },
      });

      expect(removeEventListenerSpyOverOldContainer).toBeCalledTimes(3);
      expect(addEventListenerSpyOverNewContainer).toBeCalledTimes(3);
    });

    describe('Analytics', () => {
      const expectedContext = (featureFlags: MediaFeatureFlags) => [
        {
          packageName: '@atlaskit/media-picker',
          packageVersion: '999.9.9',
          componentName: 'dropzone',
          component: 'dropzone',
          [MEDIA_CONTEXT]: {
            featureFlags,
          },
        },
      ];
      it('should fire a draggedInto event when a file is dragged over dropzone', async () => {
        const expectedPayload = (featureFlags: MediaFeatureFlags) => ({
          eventType: 'ui',
          action: 'draggedInto',
          actionSubject: 'dropzone',
          attributes: {
            fileCount: 1,
          },
        });
        const handleAnalyticsEvent = jest.fn();

        component = mount(
          <AnalyticsListener channel="media" onEvent={handleAnalyticsEvent}>
            <Dropzone
              mediaClient={mediaClient}
              config={config}
              featureFlags={defaultFeatureFlags}
            />
            ,
          </AnalyticsListener>,
        );

        expectedContainer.dispatchEvent(createDragOverEvent());

        expect(handleAnalyticsEvent).toHaveBeenCalledTimes(1);
        expect(handleAnalyticsEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            context: expectedContext(defaultFeatureFlags),
            payload: expectedPayload(defaultFeatureFlags),
          }),
          ANALYTICS_MEDIA_CHANNEL,
        );
      });

      it('should fire a draggedOut event when mouse leaves dropzone', async () => {
        const expectedPayload = (featureFlags: MediaFeatureFlags) => ({
          eventType: 'ui',
          action: 'draggedOut',
          actionSubject: 'dropzone',
          attributes: {
            fileCount: 1,
          },
        });
        const handleAnalyticsEvent = jest.fn();

        component = mount(
          <AnalyticsListener channel="media" onEvent={handleAnalyticsEvent}>
            <Dropzone
              mediaClient={mediaClient}
              config={config}
              featureFlags={defaultFeatureFlags}
            />
            ,
          </AnalyticsListener>,
        );

        expectedContainer.dispatchEvent(createDragOverEvent());
        expectedContainer.dispatchEvent(createDragLeaveEvent());

        // Drag leave has a setTimeout before firing the event we need to offset here
        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(handleAnalyticsEvent).toHaveBeenCalledTimes(2);
        expect(handleAnalyticsEvent).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({
            context: expectedContext(defaultFeatureFlags),
            payload: expectedPayload(defaultFeatureFlags),
          }),
          ANALYTICS_MEDIA_CHANNEL,
        );
      });

      it('should fire a droppedInto event when a file is dropped in dropzone', async () => {
        const expectedPayload = (featureFlags: MediaFeatureFlags) => ({
          eventType: 'ui',
          action: 'droppedInto',
          actionSubject: 'dropzone',
          attributes: {
            fileCount: 1,
          },
        });
        const handleAnalyticsEvent = jest.fn();

        component = mount(
          <AnalyticsListener channel="media" onEvent={handleAnalyticsEvent}>
            <Dropzone
              mediaClient={mediaClient}
              config={config}
              featureFlags={defaultFeatureFlags}
            />
            ,
          </AnalyticsListener>,
        );

        expectedContainer.dispatchEvent(createDragOverEvent());
        expectedContainer.dispatchEvent(createDragOverOrDropEvent('drop'));
        await asyncUpdateComponentTick(component);

        expect(handleAnalyticsEvent).toHaveBeenCalledTimes(2);
        expect(handleAnalyticsEvent).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({
            context: expectedContext(defaultFeatureFlags),
            payload: expectedPayload(defaultFeatureFlags),
          }),
          ANALYTICS_MEDIA_CHANNEL,
        );
      });

      it('should fire a folderDroppedInto event when a folder is uploaded into the dropzone', async () => {
        asMockFunction(isWebkitSupported).mockImplementationOnce(() => {
          return true;
        });

        const expectedPayload = {
          eventType: 'ui',
          action: 'folderDroppedInto',
          actionSubject: 'dropzone',
          attributes: {
            fileCount: 1,
          },
        };
        const handleAnalyticsEvent = jest.fn();

        component = mount(
          <AnalyticsListener channel="media" onEvent={handleAnalyticsEvent}>
            <Dropzone
              mediaClient={mediaClient}
              config={config}
              featureFlags={{ folderUploads: true, newCardExperience: true }}
            />
            ,
          </AnalyticsListener>,
        );

        expectedContainer.dispatchEvent(createDragOverOrDropEvent('drop'));
        await asyncUpdateComponentTick(component);

        expect(handleAnalyticsEvent).toHaveBeenCalledTimes(2);
        expect(handleAnalyticsEvent).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({
            context: expectedContext({
              folderUploads: true,
              newCardExperience: true,
            }),
            payload: expectedPayload,
          }),
          ANALYTICS_MEDIA_CHANNEL,
        );
      });
    });
  });
});
