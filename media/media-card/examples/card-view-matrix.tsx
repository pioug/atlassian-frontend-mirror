// eslint-disable-line no-console
import React from 'react';
import { atlassianLogoUrl, tallImage } from '@atlaskit/media-test-helpers';
import { Checkbox } from '@atlaskit/checkbox';
import styled from 'styled-components';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import TrashIcon from '@atlaskit/icon/glyph/trash';
import EditIcon from '@atlaskit/icon/glyph/edit';
import { CardAction, CardStatus } from '../src';
import { CardView } from '../src/root/cardView';
import { FileDetails, MediaType } from '@atlaskit/media-client';

type WrapperDimensions = {
  width: string;
  height: string;
};
const wrapperDimensionsSmall = { width: '156px', height: '108px' }; // Minimum supported dimensions
const wrapperDimensionsBig = { width: '600px', height: '450px' }; // Maximum supported dimensions
const dimensions = { width: '100%', height: '100%' };

const CardWrapper = styled.div`
  ${({ width, height }: WrapperDimensions) => `
    width: ${width};
    height: ${height};
    margin: 15px 20px;
  `}
`;

const CheckboxesContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  align-items: center;
`;

const StyledTable = styled.table`
  margin: 30px auto 0 auto;
  max-width: 1100px;
  thead * {
    text-align: center;
  }
  td,
  th {
    padding: 0;
  }
`;

const StyledContainer = styled.div`
  min-width: 1100px;
`;

interface State {
  disableOverlay: boolean;
  selectable: boolean;
  selected: boolean;
  hasRetry: boolean;
  withDataURI: boolean;
  withMetadata: boolean;
  hasActions: boolean;
  hasManyActions: boolean;
  isExternalImage: boolean;
  newExp: boolean;
  useBigCard: boolean;
  shouldRenderCard: boolean;
}

class Example extends React.Component<{}, State> {
  state: State = {
    disableOverlay: false,
    selectable: true,
    selected: false,
    hasRetry: false,
    withDataURI: true,
    withMetadata: true,
    hasActions: true,
    hasManyActions: false,
    isExternalImage: false,
    newExp: true,
    useBigCard: false,
    shouldRenderCard: true,
  };

  render() {
    const statuses: CardStatus[] = [
      'uploading',
      'loading',
      'processing',
      'complete',
      'error',
      'failed-processing',
    ];
    const mediaTypes: MediaType[] = [
      'image',
      'audio',
      'video',
      'doc',
      'unknown',
    ];

    if (!this.state.shouldRenderCard) {
      return null;
    }

    return (
      <StyledContainer>
        <CheckboxesContainer>
          <Checkbox
            value="newExp"
            label="Display the new experience?"
            isChecked={this.state.newExp}
            onChange={this.onCheckboxChange}
            name="isExternalImage"
          />
          <Checkbox
            value="withDataURI"
            label="Has withDataURI?"
            isChecked={this.state.withDataURI}
            onChange={this.onCheckboxChange}
            name="withDataURI"
          />
          <Checkbox
            value="withMetadata"
            label="Has withMetadata?"
            isChecked={this.state.withMetadata}
            onChange={this.onCheckboxChange}
            name="withMetadata"
          />
          <Checkbox
            value="disableOverlay"
            label="Disable overlay?"
            isChecked={this.state.disableOverlay}
            onChange={this.onCheckboxChange}
            name="disableOverlay"
          />
          <Checkbox
            value="selectable"
            label="Is selectable?"
            isChecked={this.state.selectable}
            onChange={this.onCheckboxChange}
            name="selectable"
          />
          <Checkbox
            value="selected"
            label="Is selected?"
            isChecked={this.state.selected}
            onChange={this.onCheckboxChange}
            name="selected"
          />
          <Checkbox
            value="hasRetry"
            label="Has retry function?"
            isChecked={this.state.hasRetry}
            onChange={this.onCheckboxChange}
            name="hasRetry"
          />
          <Checkbox
            value="hasActions"
            label="Has Actions?"
            isChecked={this.state.hasActions}
            onChange={this.onCheckboxChange}
            name="hasActions"
          />
          <Checkbox
            value="hasManyActions"
            label="Has many Actions?"
            isChecked={this.state.hasManyActions}
            onChange={this.onCheckboxChange}
            name="hasManyActions"
          />
          <Checkbox
            value="isExternalImage"
            label="Is external image?"
            isChecked={this.state.isExternalImage}
            onChange={this.onCheckboxChange}
            name="isExternalImage"
          />
          <Checkbox
            value="useBigCard"
            label="Use Big Card?"
            isChecked={this.state.useBigCard}
            onChange={event => {
              this.setState({ shouldRenderCard: false }, () =>
                this.setState({ shouldRenderCard: true }),
              );
              this.onCheckboxChange(event);
            }}
            name="useBigCard"
          />
        </CheckboxesContainer>
        <StyledTable>
          <thead>
            <tr>
              <th key="first-column" />
              <th colSpan={statuses.length}>Status</th>
            </tr>
            <tr>
              <th key="first-column">Media Type</th>
              {statuses.map(status => (
                <th key={`${status}-column`}>{status}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mediaTypes.map(mediaType => (
              <tr key={`${mediaType}-row`}>
                <th
                  style={{
                    textAlign: 'right',
                    lineHeight: '100%',
                    verticalAlign: 'middle',
                  }}
                >
                  {mediaType}
                </th>
                {statuses.map(status => (
                  <td key={`${status}-entry-${mediaType}`}>
                    {this.renderCardImageView(
                      status,
                      mediaType,
                      this.setSelected,
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </StyledContainer>
    );
  }

  private setSelected = (selected: boolean) => {
    this.setState({ selected });
  };

  private onCheckboxChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    console.log(`GOT el event`, e);
    const { value, checked } = e.currentTarget;
    this.setState({ [value]: checked } as any);
  };

  private renderCardImageView = (
    status: CardStatus,
    mediaType: MediaType = 'image',
    setSelected: (selected: boolean) => void,
  ) => {
    const {
      disableOverlay,
      selectable,
      selected,
      hasRetry,
      withDataURI,
      withMetadata,
      hasActions,
      hasManyActions,
      isExternalImage,
    } = this.state;
    const actions: CardAction[] = [
      {
        handler: () => console.log('trash clicked'),
        icon: <TrashIcon label="delete-icon" />,
        label: 'Delete',
      },
      {
        handler: () => console.log('clicked me'),
        icon: <DownloadIcon label="download-icon" />,
        label: 'Download',
      },
      ...(hasManyActions
        ? [
            {
              handler: () => console.log('clicked edit'),
              icon: <EditIcon label="edit-icon" />,
              label: 'Replace',
            },
          ]
        : []),
    ];

    const metadata: FileDetails = {
      id: 'some-file-id',
      name: 'hubert-blaine-wolfeschlegelsteinhausenbergerdorff.jpg',
      mediaType,
      size: 4200,
      createdAt: 1589481162745,
    };

    let dataURI;
    if (withDataURI) {
      if (isExternalImage) {
        dataURI = atlassianLogoUrl;
      } else {
        dataURI = tallImage;
      }
    }

    const wrapperDimensions = this.state.useBigCard
      ? wrapperDimensionsBig
      : wrapperDimensionsSmall;

    return (
      <CardWrapper {...wrapperDimensions}>
        <CardView
          featureFlags={{
            newExp: this.state.newExp,
          }}
          status={status}
          mediaItemType="file"
          metadata={withMetadata ? metadata : undefined}
          onClick={(e: React.MouseEvent) => {
            setSelected(!selected);
            console.log('mouse click!');
          }}
          onMouseEnter={(e: React.MouseEvent) => console.log('mouse enter!')}
          resizeMode="crop"
          progress={0.5}
          disableOverlay={disableOverlay}
          selectable={selectable}
          selected={selected}
          actions={hasActions ? actions : []}
          dataURI={dataURI}
          onRetry={hasRetry ? () => console.log('retrying...') : undefined}
          dimensions={dimensions}
        />
      </CardWrapper>
    );
  };
}
export default () => <Example />;
