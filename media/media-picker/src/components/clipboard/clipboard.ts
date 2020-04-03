import {
  CreateUIAnalyticsEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';

import {
  LocalUploadComponentReact,
  LocalUploadComponentBaseProps,
} from '../localUploadReact';

import {
  LocalFileSource,
  LocalFileWithSource,
  UploadService,
} from '../../service/types';

import { ANALYTICS_MEDIA_CHANNEL } from '../media-picker-analytics-error-boundary';
import { ClipboardConfig } from '../../types';
import { appendTimestamp } from '../../util/appendTimestamp';
import {
  name as packageName,
  version as packageVersion,
} from '../../version.json';

export const getFilesFromClipboard = (files: FileList) => {
  return Array.from(files).map(file => {
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

class ClipboardImpl {
  static instances: ClipboardImpl[] = [];
  uploadService: UploadService;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;

  constructor(uploadService: UploadService) {
    this.uploadService = uploadService;
  }

  static get latestInstance(): ClipboardImpl | undefined {
    return ClipboardImpl.instances[ClipboardImpl.instances.length - 1];
  }

  public activate(opts?: {
    createAnalyticsEvent?: CreateUIAnalyticsEvent;
  }): void {
    this.deactivate();

    if (opts && opts.createAnalyticsEvent) {
      this.createAnalyticsEvent = opts.createAnalyticsEvent;
    }

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
    this.fireAnalyticsEvent('pasted', files);
  }

  private fireAnalyticsEvent(
    action: string,
    files: LocalFileWithSource[],
  ): void {
    if (this.createAnalyticsEvent) {
      const analyticsEvent = this.createAnalyticsEvent({
        eventType: 'ui',
        actionSubject: 'clipboard',
        action,
        attributes: {
          packageName,
          fileCount: files.length,
          fileAttributes: files.map(({ file: { type, size } }) => ({
            fileMimetype: type,
            fileSize: size,
          })),
        },
      });
      analyticsEvent.fire(ANALYTICS_MEDIA_CHANNEL);
    }
  }

  static handleEvent = (event: Event): void => {
    // last in, first served to support multiple instances listening at once
    const instance = ClipboardImpl.latestInstance;
    if (instance) {
      /*
        Browser behaviour for getting files from the clipboard is very inconsistent and buggy.
        @see https://extranet.atlassian.com/display/FIL/RFC+099%3A+Clipboard+browser+inconsistency
      */
      const { clipboardData } = event as ClipboardEvent;

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
  clipboard: ClipboardImpl = new ClipboardImpl(this.uploadService);

  static defaultProps = {
    config: defaultConfig,
  };

  componentDidMount() {
    this.clipboard.activate({
      createAnalyticsEvent: this.props.createAnalyticsEvent,
    });
  }

  componentWillUnmount() {
    this.clipboard.deactivate();
  }

  render() {
    return null;
  }
}

export const Clipboard = withAnalyticsContext({
  attributes: {
    componentName: 'clipboard',
    packageName,
    packageVersion,
  },
})(withAnalyticsEvents()(ClipboardBase));
