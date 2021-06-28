import React from 'react';
import { KeyboardEvent } from 'react';
import LinkSearchList from './LinkSearchList';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { ActivityProvider, ActivityItem } from '@atlaskit/activity-provider';
import withActivityProvider, {
  WithActivityProviderProps,
} from './withActivityProvider';
import { RecentSearchProps, RecentSearchState } from './types';
import { INPUT_METHOD } from '../../plugins/analytics';

const DEFAULT_ITEMS_LIMIT = 5;

const limit = (items: Array<ActivityItem>, max: number) => {
  return items.slice(0, max);
};

class RecentLink extends React.Component<
  RecentSearchProps & WithActivityProviderProps & InjectedIntlProps,
  RecentSearchState
> {
  private activityProvider: ActivityProvider | null = null;

  constructor(
    props: RecentSearchProps & WithActivityProviderProps & InjectedIntlProps,
  ) {
    super(props);
    this.state = {
      selectedIndex: -1,
      isLoading: false,
      items: [],
      url: props.defaultUrl || '',
    };
  }
  static defaultProps: Partial<RecentSearchProps> = {
    limit: DEFAULT_ITEMS_LIMIT,
  };

  UNSAFE_componentWillReceiveProps(nextProps: RecentSearchProps) {
    if (this.props.defaultUrl !== nextProps.defaultUrl) {
      this.setState((state: RecentSearchState) => {
        if (state.url !== nextProps.defaultUrl) {
          return {
            items: [],
            selectedIndex: -1,
            url: nextProps.defaultUrl || '',
          };
        }
        return null;
      });
    }
  }

  async componentDidMount() {
    if (this.props.activityProvider) {
      this.activityProvider = await this.props.activityProvider;
      await this.loadRecentItems(this.activityProvider);
    }
  }

  private async loadRecentItems(activityProvider: ActivityProvider) {
    try {
      if (!this.state.url) {
        this.setState({
          isLoading: true,
          items: limit(
            await activityProvider.getRecentItems(),
            this.props.limit!,
          ), // defaultProps assure that limit always contains a value
        });
      }
    } finally {
      this.setState({ isLoading: false });
    }
  }

  private getCurrentInputMethod():
    | INPUT_METHOD.MANUAL
    | INPUT_METHOD.TYPEAHEAD
    | undefined {
    const { items, url, selectedIndex } = this.state;

    if (items && items.length > 0 && selectedIndex > -1) {
      return INPUT_METHOD.TYPEAHEAD;
    } else if (url && url.length > 0) {
      return INPUT_METHOD.MANUAL;
    }
    return;
  }

  private handleSubmit = () => {
    const { items, url, selectedIndex } = this.state;
    const inputMethod = this.getCurrentInputMethod();

    if (!inputMethod) {
      return; // No call submit, if there is nothing to submit
    }

    switch (inputMethod) {
      case INPUT_METHOD.MANUAL: {
        this.props.onSubmit({
          url,
          text: url,
          inputMethod: INPUT_METHOD.MANUAL,
        });
        break;
      }
      case INPUT_METHOD.TYPEAHEAD: {
        const item = items[selectedIndex];
        this.setState(() => ({
          url: item.url,
        }));
        if (this.props.onSubmit) {
          this.props.onSubmit({
            url: item.url,
            text: item.name,
            inputMethod: INPUT_METHOD.TYPEAHEAD,
          });
        }
        break;
      }
    }
  };

  private handleSelected = (href: string, text: string) => {
    if (this.props.onSubmit) {
      this.setState(() => ({
        url: href,
      }));
      this.props.onSubmit({
        text,
        url: href,
        inputMethod: INPUT_METHOD.TYPEAHEAD,
      });
    }
  };

  private handleChange = async (input: string) => {
    this.setState({ url: input });

    if (this.activityProvider) {
      if (input.length === 0) {
        this.setState({
          items: limit(
            await this.activityProvider.getRecentItems(),
            this.props.limit!,
          ),
          selectedIndex: -1,
        });
      } else {
        this.setState({
          items: limit(
            await this.activityProvider.searchRecent(input),
            this.props.limit!,
          ),
          selectedIndex: 0,
        });
      }
    }
  };

  private handleKeyDown = (e: KeyboardEvent<any>) => {
    const { items, selectedIndex } = this.state;

    if (!items || !items.length) {
      return;
    }

    if (e.key === 'ArrowDown') {
      // down
      e.preventDefault();
      this.setState({
        selectedIndex: (selectedIndex + 1) % items.length,
      });
    } else if (e.key === 'ArrowUp') {
      // up
      e.preventDefault();
      this.setState({
        selectedIndex: selectedIndex > 0 ? selectedIndex - 1 : items.length - 1,
      });
    }
  };

  private handleMouseMove = (objectId: string) => {
    const { items } = this.state;

    if (items) {
      const index = items.findIndex((item) => item.objectId === objectId);
      this.setState({
        selectedIndex: index,
      });
    }
  };

  private renderRecentList = () => {
    const { items, isLoading, selectedIndex } = this.state;
    return (
      <LinkSearchList
        items={items}
        isLoading={isLoading}
        selectedIndex={selectedIndex}
        onSelect={this.handleSelected}
        onMouseMove={this.handleMouseMove}
      />
    );
  };

  private clearValue = () => {
    this.setState({
      url: '',
    });
  };

  render() {
    const { render } = this.props;
    const { url } = this.state;
    return render({
      activityProvider: this.activityProvider,
      inputProps: {
        onChange: this.handleChange,
        onKeyDown: this.handleKeyDown,
        onSubmit: this.handleSubmit,
        value: url,
      },
      clearValue: this.clearValue,
      currentInputMethod: this.getCurrentInputMethod(),
      renderRecentList: this.renderRecentList,
    });
  }
}

export default withActivityProvider<
  RecentSearchProps & WithActivityProviderProps
>(injectIntl(RecentLink));
