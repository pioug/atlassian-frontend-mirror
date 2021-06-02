import {
  CreateUIAnalyticsEvent,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';

import {
  ANALYTICS_MEDIA_CHANNEL,
  withMediaAnalyticsContext,
} from '@atlaskit/media-common';

import {
  LocalUploadComponentReact,
  LocalUploadComponentBaseProps,
} from '../localUploadReact';

import {
  LocalFileSource,
  LocalFileWithSource,
  UploadService,
} from '../../service/types';

import { ClipboardPastePayload, ClipboardConfig } from '../../types';
import { getPackageAttributes } from '../../util/analytics';
import { appendTimestamp } from '../../util/appendTimestamp';

export const getFilesFromClipboard = (files: FileList) => {
  return Array.from(files).map((file) => {
    if (file.type.indexOf('image/') === 0) {
      const name = appendTimestamp(file.name, (file as any).lastModified);
      return new File([file], name, {
        type: file.type,
      });
    } else {
      return file;
    }
  });
};

export interface ClipboardOwnProps {
  config: ClipboardConfig;
}

export type ClipboardProps = LocalUploadComponentBaseProps & {
  config: ClipboardConfig;
};

const defaultConfig: ClipboardConfig = { uploadParams: {} };
const COMPONENT_NAME = 'clipboard';

class ClipboardImpl {
  static instances: ClipboardImpl[] = [];
  constructor(
    private readonly uploadService: UploadService,
    private readonly createAnalyticsEvent?: CreateUIAnalyticsEvent,
  ) {}

  static get latestInstance(): ClipboardImpl | undefined {
    return ClipboardImpl.instances[ClipboardImpl.instances.length - 1];
  }

  public activate(): void {
    this.deactivate();

    document.addEventListener('paste', ClipboardImpl.handleEvent);
    ClipboardImpl.instances.push(this);
  }

  public deactivate(): void {
    const index = ClipboardImpl.instances.indexOf(this);
    if (index > -1) {
      ClipboardImpl.instances.splice(index, 1);
    } else {
      /**
       * We want to remove the handleEvent only when there are no more instances.
       * Since handleEvent is static, if we remove it right away, and there is still an active instance,
       * we will loose the clipboard functionality.
       */
      document.removeEventListener('paste', ClipboardImpl.handleEvent);
    }
  }

  public onFilesPasted(files: LocalFileWithSource[]) {
    this.uploadService.addFilesWithSource(files);
    this.fireAnalyticsEvent(files);
  }

  private fireAnalyticsEvent(files: LocalFileWithSource[]): void {
    if (this.createAnalyticsEvent) {
      const payload: ClipboardPastePayload = {
        eventType: 'ui',
        action: 'pasted',
        actionSubject: 'clipboard',
        attributes: {
          fileCount: files.length,
          fileAttributes: files.map(({ file: { type, size }, source }) => ({
            fileSource: source,
            fileMimetype: type,
            fileSize: size,
          })),
        },
      };

      const analyticsEvent = this.createAnalyticsEvent(payload);
      analyticsEvent.fire(ANALYTICS_MEDIA_CHANNEL);
    }
  }

  static handleEvent = (event: ClipboardEvent): void => {
    // last in, first served to support multiple instances listening at once
    const instance = ClipboardImpl.latestInstance;
    if (instance) {
      /*
        Browser behaviour for getting files from the clipboard is very inconsistent and buggy.
        @see https://hello.atlassian.net/wiki/spaces/FIL/pages/141485494/RFC+099+Clipboard+browser+inconsistency

        TODO https://product-fabric.atlassian.net/browse/BMPT-1285 Investigate implementation
      */
      const { clipboardData } = event;

      if (clipboardData && clipboardData.files) {
        const fileSource =
          clipboardData.types.length === 1
            ? LocalFileSource.PastedScreenshot
            : LocalFileSource.PastedFile;

        const filesArray: LocalFileWithSource[] = getFilesFromClipboard(
          clipboardData.files,
        ).map((file: File) => ({ file, source: fileSource }));
        // only the latest instance gets the event

        if (filesArray.length > 0) {
          instance.onFilesPasted.call(instance, filesArray);
        }
      }
    }
  };
}

export class ClipboardBase extends LocalUploadComponentReact<ClipboardProps> {
  clipboard: ClipboardImpl = new ClipboardImpl(
    this.uploadService,
    this.props.createAnalyticsEvent,
  );

  constructor(props: ClipboardProps) {
    super(props, COMPONENT_NAME);
  }

  static defaultProps = {
    config: defaultConfig,
  };

  componentDidMount() {
    this.clipboard.activate();
  }

  componentWillUnmount() {
    this.clipboard.deactivate();
  }

  render() {
    return null;
  }
}

export const Clipboard = withMediaAnalyticsContext(
  getPackageAttributes(COMPONENT_NAME),
  {
    filterFeatureFlags: ['folderUploads', 'newCardExperience'],
  },
)(withAnalyticsEvents()(ClipboardBase));
