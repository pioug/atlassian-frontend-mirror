import React from 'react';
import {
  objectData,
  personData,
  containerData,
  makeAutocompleteData,
} from './mockData';
import {
  QuickSearch,
  ResultItemGroup,
  ContainerResult,
  ContainerResultProps,
  PersonResult,
  PersonResultProps,
  ObjectResult,
  ObjectResultProps,
} from '../../src';

type DataShape = {
  title: string;
  items: (ContainerResultProps | PersonResultProps | ObjectResultProps)[];
};

const data: DataShape[] = [
  {
    title: 'Objects',
    items: objectData(5),
  },
  {
    title: 'People',
    items: personData(5),
  },
  {
    title: 'Containers',
    items: containerData(5),
  },
];

const availableResultTypes: { [key: string]: React.ComponentClass<any> } = {
  person: PersonResult,
  object: ObjectResult,
  container: ContainerResult,
};

const mapResultsDataToComponents = (resultData: DataShape[]) => {
  if (!resultData || !resultData.length) {
    return 'Nothin` to see here';
  }

  return resultData.map((group: DataShape) => (
    <ResultItemGroup title={group.title} key={group.title}>
      {group.items.map((props) => {
        const Result: React.ComponentClass = availableResultTypes[props.type!];
        return Result ? <Result key={props.resultId} {...props} /> : null;
      })}
    </ResultItemGroup>
  ));
};

const mockAutocompleteData = makeAutocompleteData();

function contains(string: string, query: string) {
  return string.toLowerCase().indexOf(query.toLowerCase()) > -1;
}

function searchData(query: string): DataShape[] {
  const results = data
    .map(({ title, items }) => {
      const filteredItems = items.filter((item) =>
        contains(item.name as string, query),
      );
      return { title, items: filteredItems };
    })
    .filter((group) => group.items.length);
  return results;
}

// a little fake store for holding the query after a component unmounts
type Store = {
  query?: string;
};
const store: Store = {};

type Props = {
  fakeNetworkLatency?: number;
  isAutocompleteEnabled?: boolean;
};

type State = {
  query: string;
  results: DataShape[];
  isLoading: boolean;
  autocompleteText: string;
};

export default class BasicQuickSearch extends React.Component<Props, State> {
  static defaultProps = {
    fakeNetworkLatency: 0,
    isAutocompleteEnabled: false,
  };

  state = {
    query: store.query || '',
    results: searchData(''),
    isLoading: false,
    autocompleteText: '',
  };

  searchTimeoutId: any;

  setQuery(query: string) {
    store.query = query;
    this.setState({
      query,
    });
  }

  search = (query: string) => {
    if (this.searchTimeoutId) {
      clearTimeout(this.searchTimeoutId);
    }
    this.setState({
      isLoading: true,
    });
    this.setQuery(query);
    const results = searchData(query);
    this.searchTimeoutId = window.setTimeout(() => {
      this.setState({
        results,
        isLoading: false,
      });
    }, this.props.fakeNetworkLatency);
  };

  autocomplete = (query: string) => {
    const tokens = query.split(' ');
    const lastToken = tokens.slice(-1)[0];
    if (lastToken.length === 0) {
      this.setState({
        autocompleteText: query,
      });
      return;
    }
    const restTokens = tokens.slice(0, -1);
    const autocompleteList = mockAutocompleteData
      .filter((token) => token.startsWith(lastToken))
      .map((token) => restTokens.concat([token]).join(' '));
    this.setState({
      autocompleteText: autocompleteList[0],
    });
  };

  onSearchInput = ({ target }: React.FormEvent<HTMLInputElement>) => {
    const query = (target as HTMLInputElement).value;
    this.search(query);
    if (this.props.isAutocompleteEnabled) {
      this.autocomplete(query);
    }
  };

  render() {
    return (
      <QuickSearch
        isLoading={this.state.isLoading}
        onSearchInput={this.onSearchInput}
        onSearchSubmit={() => console.log('onSearchSubmit', this.state.query)}
        value={this.state.query}
        autocompleteText={
          this.props.isAutocompleteEnabled
            ? this.state.autocompleteText
            : undefined
        }
      >
        <div style={{ paddingLeft: '10px' }}>
          {mapResultsDataToComponents(this.state.results)}
        </div>
      </QuickSearch>
    );
  }
}
