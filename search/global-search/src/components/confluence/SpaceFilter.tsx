import { withAnalytics } from '@atlaskit/analytics';
import Avatar from '@atlaskit/avatar';
import Checkbox from '@atlaskit/checkbox/Checkbox';
import baseItem, { withItemFocus } from '@atlaskit/item';
import React from 'react';
import {
  FilterType,
  FilterWithMetadata,
} from '../../api/CrossProductSearchClient';
import { fireSpaceFilterShownEvent } from '../../util/analytics-event-helper';
import { CreateAnalyticsEventFn } from '../analytics/types';

const Item = withItemFocus(baseItem);

export interface Props {
  spaceAvatar: string;
  spaceTitle: string;
  spaceKey: string;
  searchSessionId: string;
  isDisabled?: boolean;
  isFilterOn?: boolean;
  onFilterChanged(filter: FilterWithMetadata[]): void;

  // These are provided by the withAnalytics HOC
  createAnalyticsEvent?: CreateAnalyticsEventFn;
}

interface State {
  isChecked: boolean;
}

export class ConfluenceSpaceFilter extends React.Component<Props, State> {
  state = {
    isChecked: false,
  };

  generateFilter = (): FilterWithMetadata[] => {
    const { isChecked } = this.state;
    const { spaceAvatar, spaceTitle, spaceKey } = this.props;
    return isChecked
      ? []
      : [
          {
            filter: {
              '@type': FilterType.Spaces,
              spaceKeys: [spaceKey],
            },
            metadata: {
              spaceTitle,
              spaceAvatar,
            },
          },
        ];
  };

  toggleCheckbox = () => {
    const { isChecked } = this.state;
    const filter = this.generateFilter();
    this.props.onFilterChanged(filter);
    this.setState({
      isChecked: !isChecked,
    });
  };

  handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleCheckbox();
    }
  };

  componentDidMount() {
    fireSpaceFilterShownEvent(
      this.props.searchSessionId,
      this.props.createAnalyticsEvent,
    );
  }

  getIcons() {
    const { isDisabled, spaceAvatar } = this.props;

    return (
      <>
        <Checkbox isChecked={this.state.isChecked} isDisabled={isDisabled} />
        <Avatar
          borderColor="transparent"
          src={spaceAvatar}
          appearance="square"
          size="small"
          isDisabled={isDisabled}
        />
      </>
    );
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (state.isChecked !== props.isFilterOn) {
      return { isChecked: props.isFilterOn };
    }
    return null;
  }

  render() {
    const { isDisabled, spaceTitle } = this.props;

    return (
      <Item
        onClick={this.toggleCheckbox}
        onKeyDown={this.handleKeyDown}
        elemBefore={this.getIcons()}
        isCompact
        isDisabled={isDisabled}
      >
        {spaceTitle}
      </Item>
    );
  }
}

export default withAnalytics(ConfluenceSpaceFilter, {}, {});
