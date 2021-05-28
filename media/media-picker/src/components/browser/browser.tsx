import React from 'react';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { withMediaAnalyticsContext } from '@atlaskit/media-common';
import isValidId from 'uuid-validate';
import { BrowserConfig } from '../../types';
import {
  LocalUploadComponentReact,
  LocalUploadComponentBaseProps,
} from '../localUploadReact';
import { getPackageAttributes } from '../../util/analytics';

export interface BrowserOwnProps {
  config: BrowserConfig;
  isOpen?: boolean;
  onClose?: () => void;
  /**
   * This prop will be mainly used for those contexts (like Editor) where there is no react lifecylce and we cannot rerender easily.
   * Otherwise, isOpen prop is preferred.
   */
  onBrowseFn?: (browse: () => void) => void;
  onCancelFn?: (cancel: (uniqueIdentifier: string) => void) => void;
  children?: (browse: () => void) => React.ReactChild;
}

export type BrowserProps = LocalUploadComponentBaseProps & BrowserOwnProps;

const defaultConfig: BrowserConfig = { uploadParams: {} };
const COMPONENT_NAME = 'browser';

export class BrowserBase extends LocalUploadComponentReact<BrowserProps> {
  private browserRef = React.createRef<HTMLInputElement>();

  constructor(props: BrowserProps) {
    super(props, COMPONENT_NAME);
    const { config, onError } = props;

    const { replaceFileId } = config;
    if (replaceFileId && !isValidId(replaceFileId)) {
      this.createAndFireAnalyticsEvent({
        eventType: 'operational',
        action: 'failed',
        actionSubject: 'mediaUpload',
        actionSubjectId: 'localMedia',
        attributes: {
          status: 'fail',
          failReason: 'invalid_uuid',
          uuid: replaceFileId,
        },
      });
      onError &&
        onError({
          fileId: replaceFileId,
          error: {
            description: 'Invalid replaceFileId format',
            name: 'invalid_uuid',
            fileId: replaceFileId,
          },
        });
    }
  }

  static defaultProps = {
    config: defaultConfig,
  };

  private onFilePicked = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target) {
      return;
    }

    const { replaceFileId } = this.props.config;
    const filesArray = [].slice.call(event.target.files);

    // refreshes uploadParams as only set once in parent constructor
    this.setUploadParams(this.props.config.uploadParams);

    try {
      if (replaceFileId) {
        this.uploadService.addFile(filesArray[0], replaceFileId);
      } else {
        this.uploadService.addFiles(filesArray);
      }
    } finally {
      if (this.browserRef.current) {
        this.browserRef.current.value = '';
      }
    }
  };

  componentDidMount() {
    const { onBrowseFn, onCancelFn, isOpen } = this.props;

    if (onBrowseFn) {
      onBrowseFn(this.browse);
    }

    if (onCancelFn) {
      onCancelFn(this.cancel);
    }

    if (isOpen) {
      this.browse();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: BrowserProps) {
    const { isOpen } = this.props;
    const { isOpen: nextIsOpen } = nextProps;

    if (nextIsOpen && nextIsOpen !== isOpen) {
      this.browse();
    }
  }

  public browse: () => void = () => {
    const { onClose } = this.props;
    if (!this.browserRef.current) {
      return;
    }

    this.browserRef.current.click();
    // Calling onClose directly since there is no dom api to notify us when
    // the native file picker is closed
    if (onClose) {
      onClose();
    }
  };

  render() {
    const { config, children } = this.props;
    const { multiple, replaceFileId } = config;
    const fileExtensions =
      config.fileExtensions && config.fileExtensions.join(',');

    return (
      <>
        <input
          data-testid="media-picker-file-input"
          ref={this.browserRef}
          type="file"
          style={{ display: 'none' }}
          multiple={
            replaceFileId
              ? false
              : multiple /* if the consumer passes the fileId we must work in single selection mode */
          }
          accept={fileExtensions}
          onChange={this.onFilePicked}
        />
        {children ? children(this.browse) : null}
      </>
    );
  }
}

export const Browser = withMediaAnalyticsContext(
  getPackageAttributes(COMPONENT_NAME),
  {
    filterFeatureFlags: ['folderUploads', 'newCardExperience'],
  },
)(withAnalyticsEvents()(BrowserBase));
