import React from 'react';
import PropTypes from 'prop-types';
import {
  defaultCollectionName,
  createStorybookMediaClientConfig,
  createUploadMediaClientConfig,
} from '@atlaskit/media-test-helpers';
import { Card } from '@atlaskit/media-card';
import { MediaViewerDataSource } from '@atlaskit/media-viewer';
import { Checkbox } from '@atlaskit/checkbox';
import {
  FileIdentifier,
  ExternalImageIdentifier,
} from '@atlaskit/media-client';
import Button from '@atlaskit/button/standard-button';
import Select, { ValueType } from '@atlaskit/select';
import { SelectWrapper, OptionsWrapper } from '../example-helpers/styled';
import { MediaPicker } from '../src';
import { PluginItemPayload } from '../src/domain/plugin';
import {
  UploadPreviewUpdateEventPayload,
  MediaFile,
  Popup,
  UploadEndEventPayload,
  PopupConfig,
  UploadErrorEventPayload,
} from '../src/types';
import Banner from '@atlaskit/banner';
import WarningIcon from '@atlaskit/icon/glyph/warning';

const userMediaClientConfig = createUploadMediaClientConfig();
const tenantMediaClientConfig = createStorybookMediaClientConfig();

interface DataSourceOption {
  label: string;
  value: DataSourceType;
}

const dataSourceOptions: DataSourceOption[] = [
  { label: 'List', value: 'list' },
  { label: 'Collection', value: 'collection' },
];

export type TenantFileRecord = {
  id?: string;
  src?: string;
  occurrenceKey?: string;
};
export type DataSourceType = 'collection' | 'list';
export interface State {
  events: TenantFileRecord[];
  dataSourceType: DataSourceType;
  isUseForgePluginsDefaultEnabled: boolean;
  popup?: Popup;
  showUploadErrorBanner: boolean;
}

export default class Example extends React.Component<{}, State> {
  state: State = {
    showUploadErrorBanner: false,
    events: [],
    dataSourceType: 'list',
    isUseForgePluginsDefaultEnabled:
      window && window.localStorage.getItem('useForgePlugins') === 'true',
  };

  static contextTypes = {
    // Required context in order to integrate analytics in media picker
    getAtlaskitAnalyticsEventHandlers: PropTypes.func,
  };

  createPopup = async (config?: Partial<PopupConfig>) => {
    const popup = await MediaPicker(userMediaClientConfig, {
      uploadParams: {
        collection: defaultCollectionName,
      },
      ...config,
    });

    popup.on('plugin-items-inserted', (items: PluginItemPayload[]) => {
      const { events } = this.state;
      const newEvents: TenantFileRecord[] = items.map(item => {
        const { pluginName } = item;
        console.log('Inserting from', pluginName);
        return { src: item.pluginFile.metadata.src };
      });

      this.setState({
        events: [...events, ...newEvents],
      });
    });

    popup.on('uploads-start', (payload: { files: MediaFile[] }) => {
      const { events } = this.state;
      payload.files.forEach(file => {
        console.log('PUBLIC: uploads-start', file.id);
      });

      this.setState({
        events: [
          ...events,
          ...payload.files.map(file => ({
            id: file.id,
            occurrenceKey: file.occurrenceKey,
          })),
        ],
      });
    });

    popup.on('upload-preview-update', this.onUploadPreviewUpdate);
    popup.on('upload-end', this.onUploadEnd);
    popup.on('upload-error', this.onUploadError);

    return popup;
  };

  async componentDidMount() {
    const { isUseForgePluginsDefaultEnabled } = this.state;
    const popup = await this.createPopup({
      useForgePlugins: isUseForgePluginsDefaultEnabled,
    });

    this.setState({ popup });
  }

  private onUploadEnd = (event: UploadEndEventPayload) => {
    console.log('PUBLIC: onUploadEnd', event.file.id);
  };

  private onUploadPreviewUpdate = async (
    event: UploadPreviewUpdateEventPayload,
  ) => {
    console.log('PUBLIC: upload-preview-update', event);
  };

  private onUploadError = (event: UploadErrorEventPayload) => {
    console.error('!!! OI LOOK HERE !!! PUBLIC: onUploadError', event);
    this.setState({
      showUploadErrorBanner: true,
    });
  };

  private getMediaViewerDataSource = (): MediaViewerDataSource => {
    const { dataSourceType, events } = this.state;
    const list: FileIdentifier[] = events.map(event => {
      const identifier: FileIdentifier = {
        id: event.id!,
        occurrenceKey: event.occurrenceKey || '',
        mediaItemType: 'file',
      };

      return identifier;
    });

    return dataSourceType === 'collection'
      ? { collectionName: defaultCollectionName }
      : { list };
  };

  private renderCards = () => {
    const { events } = this.state;

    return events.map((fileRecord, key) => {
      let identifier: FileIdentifier | ExternalImageIdentifier | undefined;

      if (fileRecord.id) {
        identifier = {
          id: fileRecord.id,
          mediaItemType: 'file',
          collectionName: defaultCollectionName,
          occurrenceKey: fileRecord.occurrenceKey,
        };
      } else if (fileRecord.src) {
        identifier = {
          mediaItemType: 'external-image',
          dataURI: fileRecord.src,
        };
      }

      if (!identifier) {
        return null;
      }

      return (
        <div key={key} style={{ display: 'inline-block', margin: '10px' }}>
          <Card
            mediaClientConfig={tenantMediaClientConfig}
            identifier={identifier}
            dimensions={{
              width: 200,
              height: 200,
            }}
            shouldOpenMediaViewer={true}
            mediaViewerDataSource={this.getMediaViewerDataSource()}
          />
        </div>
      );
    });
  };

  private onDataSourceChange = (option: ValueType<DataSourceOption>) => {
    if (!option) {
      return;
    }

    this.setState({
      dataSourceType: (option as DataSourceOption).value,
    });
  };

  private onUseForgePluginsChange = async (event: any) => {
    const { popup } = this.state;
    const useForgePlugins = event.target.checked;

    if (popup) {
      popup.teardown();
    }

    const newPopup = await this.createPopup({ useForgePlugins });

    window.localStorage.setItem('useForgePlugins', useForgePlugins);

    this.setState({ popup: newPopup });
  };

  render() {
    const {
      popup,
      isUseForgePluginsDefaultEnabled,
      showUploadErrorBanner,
    } = this.state;

    return (
      <React.Fragment>
        <Banner
          icon={<WarningIcon label="Warning icon" secondaryColor="inherit" />}
          isOpen={showUploadErrorBanner}
          appearance="warning"
        >
          upload-error was emitted
        </Banner>
        <OptionsWrapper>
          <Button
            appearance="primary"
            id="show"
            onClick={() => {
              if (popup) {
                popup.show();
              }
              this.setState({
                showUploadErrorBanner: false,
              });
            }}
          >
            Show
          </Button>
          <SelectWrapper>
            <Select
              options={dataSourceOptions}
              defaultValue={dataSourceOptions[0]}
              onChange={this.onDataSourceChange}
            />
          </SelectWrapper>
          <Checkbox
            defaultChecked={isUseForgePluginsDefaultEnabled}
            label="useForgePlugins 🔥"
            onChange={this.onUseForgePluginsChange}
            name="checkbox-basic"
          />
        </OptionsWrapper>
        <div>{this.renderCards()}</div>
      </React.Fragment>
    );
  }
}
