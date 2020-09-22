import React from 'react';
import { Component, FormEvent } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { messages } from '@atlaskit/media-ui';
import TextField from '@atlaskit/textfield';
import Button from '@atlaskit/button/custom-theme-button';
import Spinner from '@atlaskit/spinner';
import { Card } from '@atlaskit/media-card';
import { ExternalImageIdentifier } from '@atlaskit/media-client';
import { BricksLayout } from '../../../../plugins/views/bricks/grid';
import { fileClick } from '../../../actions/fileClick';
import { ImageCardModel } from '../../../tools/fetcher/fetcher';
import gridCellScaler from '../../../tools/gridCellScaler';
import { State, SelectedItem } from '../../../domain';
import { searchGiphy } from '../../../actions/searchGiphy';
import NetworkErrorWarning from '../warnings/networkError';

import {
  Title,
  ButtonContainer,
  GridCell,
  WarningContainer,
  WarningImage,
  WarningHeading,
  WarningSuggestion,
} from '../warnings/styles';
import { PluginContentContainer } from '../../../../plugins/forge/components/styled';

const NUMBER_OF_COLUMNS = 4;
const GAP_SIZE = 5;
const CONTAINER_WIDTH = 677;

export interface GiphyViewStateProps {
  hasError: boolean;
  isLoading: boolean;
  cardModels: ImageCardModel[];
  totalResultCount?: number;
  selectedItems: SelectedItem[];
}

export interface GiphyViewDispatchProps {
  onSearchQueryChange(query: string): void;
  onLoadMoreButtonClick(query: string, shouldAppendResults: boolean): void;
  onCardClick(item: ImageCardModel): void;
}

export type GiphyViewProps = GiphyViewStateProps &
  GiphyViewDispatchProps &
  InjectedIntlProps;

export interface GiphyViewState {
  query: string;
}

export class GiphyView extends Component<GiphyViewProps, GiphyViewState> {
  private searchChangeHandler: (e: FormEvent<HTMLInputElement>) => void;

  constructor(props: GiphyViewProps) {
    super(props);

    this.state = {
      query: '',
    };

    this.searchChangeHandler = this.createSearchChangeHandler();
  }

  componentDidUpdate({
    onSearchQueryChange: oldOnSearchQueryChange,
  }: GiphyViewProps) {
    const { onSearchQueryChange: newOnSearchQueryChange } = this.props;

    if (oldOnSearchQueryChange !== newOnSearchQueryChange) {
      this.createSearchChangeHandler();
    }
  }

  render(): JSX.Element {
    const {
      intl: { formatMessage },
    } = this.props;
    const { query } = this.state;

    return (
      <PluginContentContainer id="mediapicker-giphy-container">
        <Title>GIPHY</Title>
        <TextField
          placeholder={formatMessage(messages.search_all_gifs)}
          onChange={this.searchChangeHandler}
          value={query}
        />
        {this.getContent()}
      </PluginContentContainer>
    );
  }

  private getContent = () => {
    const { hasError, isLoading, cardModels } = this.props;

    if (hasError) {
      return this.renderError();
    }

    if (!isLoading && cardModels.length === 0) {
      return this.renderEmptyState();
    }

    return this.renderSearchResults();
  };

  private renderError = () => {
    return <NetworkErrorWarning action={this.handleRetryButtonClick} />;
  };

  private renderEmptyState = () => {
    const { query } = this.state;

    // The GIF used in this error state is too large to store as a data URI (> 3.2 MB)
    return (
      <WarningContainer>
        <WarningImage src="https://media1.giphy.com/media/10YK5Hh53nC3dK/200w.gif" />
        <WarningHeading>
          <FormattedMessage {...messages.no_gifs_found} />
        </WarningHeading>
        <WarningSuggestion>
          <FormattedMessage
            {...messages.no_gifs_found_suggestion}
            values={{ query }}
          />
        </WarningSuggestion>
      </WarningContainer>
    );
  };

  private renderSearchResults = () => {
    const { isLoading, cardModels, totalResultCount } = this.props;

    const isThereAreMoreResults =
      totalResultCount === undefined ||
      cardModels.length < totalResultCount - 1;
    const shouldShowLoadMoreButton = isLoading || isThereAreMoreResults;

    const loadMoreButton =
      shouldShowLoadMoreButton && this.renderLoadMoreButton();

    return (
      <div>
        {this.renderMasonaryLayout(this.props.cardModels)}
        {loadMoreButton}
      </div>
    );
  };

  private renderMasonaryLayout = (cardModels: ImageCardModel[]) => {
    if (cardModels.length === 0) {
      return null;
    }

    const cards = cardModels.map((cardModel, i) => {
      const { dataURI, metadata, dimensions: actualDimensions } = cardModel;
      const { selectedItems } = this.props;

      const selected = selectedItems.some(
        item => item.id === metadata.id && item.serviceName === 'giphy',
      );
      const dimensions = gridCellScaler({
        ...actualDimensions,
        gapSize: GAP_SIZE,
        containerWidth: CONTAINER_WIDTH,
        numberOfColumns: NUMBER_OF_COLUMNS,
      });
      const identifier: ExternalImageIdentifier = {
        mediaItemType: 'external-image',
        dataURI,
        name: metadata.name,
      };

      return (
        <GridCell key={`${i}-metadata.id`} width={dimensions.width}>
          <Card
            identifier={identifier}
            mediaClientConfig={{} as any}
            dimensions={dimensions}
            selectable={true}
            selected={selected}
            onClick={this.createClickHandler(cardModel)}
          />
        </GridCell>
      );
    });

    return (
      <BricksLayout
        id="mediapicker-gif-layout"
        sizes={[{ columns: NUMBER_OF_COLUMNS, gutter: GAP_SIZE }]}
      >
        {cards}
      </BricksLayout>
    );
  };

  private renderLoadMoreButton = () => {
    const { isLoading } = this.props;
    const iconAfter = isLoading ? <Spinner /> : undefined;

    return (
      <ButtonContainer>
        <Button
          onClick={this.handleLoadMoreButtonClick}
          isDisabled={isLoading}
          iconAfter={iconAfter}
        >
          <FormattedMessage {...messages.load_more_gifs} />
        </Button>
      </ButtonContainer>
    );
  };

  private createSearchChangeHandler = () => {
    const { onSearchQueryChange } = this.props;
    const debouncedOnSearchQueryChange = debounce(onSearchQueryChange, 1000);

    return (e: FormEvent<HTMLInputElement>) => {
      const query: string = e.currentTarget.value;
      this.setState({
        query,
      });

      debouncedOnSearchQueryChange(query);
    };
  };

  private createClickHandler = (cardModel: ImageCardModel) => () => {
    const { onCardClick } = this.props;

    onCardClick(cardModel);
  };

  private handleLoadMoreButtonClick = () => {
    const { onLoadMoreButtonClick } = this.props;
    onLoadMoreButtonClick(this.state.query, true);
  };

  private handleRetryButtonClick = () => {
    const { onSearchQueryChange } = this.props;
    onSearchQueryChange(this.state.query);
  };
}

export default connect<GiphyViewStateProps, GiphyViewDispatchProps, {}, State>(
  state => ({
    hasError: state.view.hasError,
    isLoading: state.view.isLoading,
    cardModels: state.giphy.imageCardModels,
    totalResultCount: state.giphy.totalResultCount,
    selectedItems: state.selectedItems,
  }),
  dispatch => ({
    onSearchQueryChange: query => dispatch(searchGiphy(query, false)),
    onLoadMoreButtonClick: (query, shouldAppendResults) =>
      dispatch(searchGiphy(query, shouldAppendResults)),
    onCardClick: cardModel => {
      const { id, name, size } = cardModel.metadata;

      dispatch(
        fileClick(
          {
            mimeType: 'image/gif',
            id: id || '',
            name: name || '',
            size: size || 0,
            date: Date.now(),
          },
          'giphy',
        ),
      );
    },
  }),
)(injectIntl(GiphyView));
