import React, { ErrorInfo } from 'react';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import TableTree, {
  Headers,
  Header,
  Rows,
  Row,
  Cell,
} from '@atlaskit/table-tree';
import { Provider, Card, CardAppearance, CardContext } from '../src';
import urlsJSON from '../examples-helpers/example-urls.json';
import styled from 'styled-components';
import { IntlProvider } from 'react-intl';

const PatchedCell = styled(Cell)`
  & > span {
    width: 100%;
  }
`;

type EnvironmentsKeys = 'prod' | 'stg' | 'dev';
const environments = ['prod', 'stg', 'dev'];
import SmartCardClient from '../src/client';

enum GroupingModes {
  none = 'none',
  provider = 'provider',
  type = 'type',
  visibility = 'visibility',
}

export type CardExample = {
  title: string;
  idx: number;
  example?: any;
  children?: CardExample[];
};

type GroupingMode = keyof typeof GroupingModes;

type ExampleUrlData = {
  provider: string;
  visibility: string;
  type: string;
  url: string;
  description?: string;
};

type WithTitle = {
  title: String;
};

const exampleUrls: ExampleUrlData[] = urlsJSON;
type GroupedExampleUrls = {
  [title: string]: Array<ExampleUrlData & WithTitle>;
};

type ExampleState = {
  groupingMode: GroupingMode;
  appearanceMode: CardAppearance;
  environment: EnvironmentsKeys;
  authFlow: CardContext['config']['authFlow'];
};

const DivWithMargin = styled.div`
  margin: 10px 0;
`;

const ucFirst = (text: string): string =>
  text[0].toUpperCase() + text.substring(1);

class Example extends React.Component<{}, ExampleState> {
  state: ExampleState = {
    groupingMode: 'none',
    appearanceMode: 'block',
    environment: 'stg',
    authFlow: 'oauth2',
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error);
    console.error(errorInfo);
  }

  handleGroupClick = (groupingMode: GroupingMode) => {
    this.setState({ groupingMode });
  };

  handleAppearanceClick = (appearanceMode: CardAppearance) => {
    this.setState({ appearanceMode });
  };

  handleEnvClick = (environment: EnvironmentsKeys) => {
    this.setState({ environment });
  };

  handleAuthFlowClick = (authFlow: ExampleState['authFlow']) => {
    this.setState({ authFlow });
  };

  getGroupedUrls(mode: GroupingMode): GroupedExampleUrls {
    // Normalize descriptions for each example
    const urlsWithTitles = exampleUrls.map((example) => ({
      ...example,
      title: this.getTitle(mode, example),
    }));

    const exampleSortCmp = (
      a: ExampleUrlData & WithTitle,
      b: ExampleUrlData & WithTitle,
    ) => (a.title > b.title ? 1 : -1);

    if (mode === 'none') {
      return { '': urlsWithTitles.sort(exampleSortCmp) };
    } else {
      return urlsWithTitles.reduce(
        (grouped, example) => ({
          ...grouped,
          [example[mode]]: [
            ...(grouped[example[mode]]
              ? grouped[example[mode]].sort(exampleSortCmp)
              : []),
            example,
          ],
        }),
        {} as GroupedExampleUrls,
      );
    }
  }

  getTitle(mode: GroupingMode, data: ExampleUrlData) {
    if (data.description) {
      return data.description;
    }

    switch (mode) {
      case 'none':
        return `${data.provider} ${data.visibility} ${data.type}`;

      case 'provider':
        return `${ucFirst(data.visibility)} ${data.type}`;

      case 'type':
        return `${data.provider} ${data.visibility}`;

      case 'visibility':
        return `${data.provider} ${data.type}`;
    }
  }

  renderGroups(mode: GroupingMode, appearanceMode: CardAppearance) {
    const grouped = this.getGroupedUrls(mode);

    // Sort the sections for easier browsing
    const sortedTitles = [] as Array<string>;
    sortedTitles.push.apply(sortedTitles, Object.keys(grouped));
    sortedTitles.sort();

    let tree;
    if (mode !== 'none') {
      tree = sortedTitles.map((title, idx) => ({
        idx,
        title,
        children: (grouped[title] || []).map((example, idx) => ({
          idx,
          example,
          title: this.getTitle(mode, example),
        })),
      }));
    } else {
      tree = (grouped[''] || []).map((example, idx) => ({
        idx,
        example,
        title: this.getTitle(mode, example),
      }));
    }

    return (
      <TableTree>
        <Headers>
          <Header width={'30%'}>
            {mode.substring(0, 1).toUpperCase() + mode.substring(1)}
          </Header>
          <Header width={'70%'}>&nbsp;</Header>
        </Headers>
        <Rows
          items={tree}
          render={({ title, idx, example, children }: CardExample) => (
            <Row
              itemId={`${idx}-${title}`}
              items={children}
              hasChildren={children && children.length > 0}
            >
              <Cell singleLine>{title}</Cell>
              <PatchedCell>
                {!example ? (
                  ''
                ) : (
                  <Card url={example.url} appearance={appearanceMode} />
                )}
              </PatchedCell>
            </Row>
          )}
        />
      </TableTree>
    );
  }

  renderButtons(
    currentGroupingMode: GroupingMode,
    currentAppearanceMode: CardAppearance,
    currentEnv: EnvironmentsKeys,
    authFlow: ExampleState['authFlow'],
  ) {
    return (
      <ButtonGroup>
        <Button isDisabled appearance="link">
          Group by:
        </Button>
        {Object.keys(GroupingModes).map((mode) => (
          <Button
            key={mode}
            isSelected={mode === currentGroupingMode}
            onClick={() => this.handleGroupClick(mode as GroupingMode)}
          >
            {mode}
          </Button>
        ))}
        <Button isDisabled appearance="link">
          Render as:
        </Button>
        <Button
          key={'render-mode-inline'}
          isSelected={currentAppearanceMode === 'inline'}
          onClick={() => this.handleAppearanceClick('inline')}
        >
          inline card
        </Button>
        <Button
          key={'render-mode-block'}
          isSelected={currentAppearanceMode === 'block'}
          onClick={() => this.handleAppearanceClick('block')}
        >
          block card
        </Button>
        <Button
          key={'render-mode-block'}
          isSelected={currentAppearanceMode === 'embed'}
          onClick={() => this.handleAppearanceClick('embed')}
        >
          embed card
        </Button>
        <Button isDisabled appearance="link">
          Environment:
        </Button>
        {environments.map((env) => (
          <Button
            key={env}
            isSelected={env === currentEnv}
            onClick={() => this.handleEnvClick(env as EnvironmentsKeys)}
          >
            {env}
          </Button>
        ))}
        <Button isDisabled appearance="link">
          OAuth Flow:
        </Button>
        <Button
          isSelected={authFlow === 'oauth2'}
          onClick={() => this.handleAuthFlowClick('oauth2')}
        >
          Enabled
        </Button>
        <Button
          isSelected={authFlow === 'disabled'}
          onClick={() => this.handleAuthFlowClick('disabled')}
        >
          Disabled
        </Button>
      </ButtonGroup>
    );
  }

  render() {
    const { groupingMode, appearanceMode, environment, authFlow } = this.state;

    return (
      <IntlProvider locale="en">
        <Provider client={new SmartCardClient(environment)} authFlow={authFlow}>
          <DivWithMargin>
            {this.renderButtons(
              groupingMode,
              appearanceMode,
              environment,
              authFlow,
            )}
            {this.renderGroups(groupingMode, appearanceMode)}
          </DivWithMargin>
        </Provider>
      </IntlProvider>
    );
  }
}

export default () => <Example />;
