import React, { Component, FormEvent, ComponentType } from 'react';
import styled from '@emotion/styled';

import Button from '@atlaskit/button';
import TextField from '@atlaskit/textfield';

import metadata from '../src/metadata';
import IconExplorerCell from './utils/icon-explorer-cell';

const allIcons = Promise.all(
  Object.keys(metadata).map(async (name) => {
    const icon = await import(`../glyph/${name}.js`);
    return { name, icon: icon.default };
  }),
).then((newData) =>
  newData
    .map((icon) => ({
      [icon.name]: { ...metadata[icon.name], component: icon.icon },
    }))
    .reduce((acc, b) => ({ ...acc, ...b })),
);

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const IconGridWrapper = styled.div({
  padding: '10px 5px 0',
});

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const IconExplorerGrid = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  marginTop: '10px',
});

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const NoIcons = styled.div({
  marginTop: '10px',
  padding: '10px',
});

interface Icon {
  keywords: string[];
  component: ComponentType;
  componentName: string;
  package: string;
}

const filterIcons = (icons: Record<string, Icon>, query: string) => {
  const regex = new RegExp(query);
  return Object.keys(icons)
    .map((index) => icons[index])
    .filter((icon) =>
      icon.keywords
        .map((keyword) => (regex.test(keyword) ? 1 : 0))
        .reduce<number>((allMatches, match) => allMatches + match, 0),
    );
};

interface State {
  query: string;
  showIcons: boolean;
  allIcons?: { [key: string]: Icon };
}

class IconAllExample extends Component<{}, State> {
  state: State = {
    query: '',
    showIcons: true,
  };

  componentDidMount() {
    allIcons.then((iconsMap) => this.setState({ allIcons: iconsMap }));
  }

  updateQuery = (query: string) => this.setState({ query, showIcons: true });

  toggleShowIcons = () => this.setState({ showIcons: !this.state.showIcons });

  renderIcons = () => {
    if (!this.state.allIcons) {
      return <div>Loading Icons...</div>;
    }
    const icons: Icon[] = filterIcons(this.state.allIcons, this.state.query);

    return icons.length ? (
      <IconExplorerGrid>
        {icons.map((icon) => (
          <IconExplorerCell {...icon} key={icon.componentName} />
        ))}
      </IconExplorerGrid>
    ) : (
      <NoIcons>{`Sorry, we couldn't find any icons matching "${this.state.query}".`}</NoIcons>
    );
  };

  render() {
    return (
      <div>
        <TextField
          key="Icon search"
          onChange={(event: FormEvent<HTMLInputElement>) =>
            this.updateQuery(event.currentTarget.value)
          }
          placeholder="Search for an icon..."
          value={this.state.query}
        />
        <IconGridWrapper>
          <p>
            <Button
              appearance="subtle-link"
              onClick={() => this.toggleShowIcons()}
              spacing="none"
            >
              {this.state.showIcons ? 'Hide icons' : 'Show all icons'}
            </Button>
          </p>
          {this.state.showIcons ? this.renderIcons() : null}
        </IconGridWrapper>
      </div>
    );
  }
}

export default IconAllExample;
