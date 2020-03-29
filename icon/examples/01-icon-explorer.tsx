import React, { Component, SyntheticEvent, ComponentType } from 'react';
import styled from 'styled-components';

import Button from '@atlaskit/button';
import Textfield from '@atlaskit/textfield';
import { metadata as objectIconMetadata } from '@atlaskit/icon-object';
import { metadata as fileTypeIconMetadata } from '@atlaskit/icon-file-type';
import { metadata as priorityIconMetadata } from '@atlaskit/icon-priority';

import { metadata } from '../src';
import IconExplorerCell from './utils/IconExplorerCell';
import logoIcons from '../utils/logoIcons';

type IconsList = Record<string, IconType>;

// WARNING
// It is going to be very tempting to move these into some higher level abstraction
// They need to live at the root because of the dynamic imports so webpack resolves
// them correctly

const iconIconInfo = Promise.all(
  Object.keys(metadata).map(async (name: string) => {
    const icon = await import(`../glyph/${name}.js`);
    return { name, icon: icon.default };
  }),
).then(newData =>
  newData
    .map(icon => ({
      [icon.name]: {
        ...(metadata as { [key: string]: any })[icon.name],
        component: icon.icon,
      },
    }))
    .reduce((acc, b) => ({ ...acc, ...b })),
);
const objectIconInfo = Promise.all(
  Object.keys(objectIconMetadata).map(async (name: string) => {
    const icon = await import(`@atlaskit/icon-object/glyph/${name}.js`);
    return { name, icon: icon.default };
  }),
).then(newData =>
  newData
    .map(icon => ({
      [icon.name]: { ...objectIconMetadata[icon.name], component: icon.icon },
    }))
    .reduce((acc, b) => ({ ...acc, ...b })),
);
const fileTypeIconInfo = Promise.all(
  Object.keys(fileTypeIconMetadata).map(async (name: string) => {
    const icon = await import(`@atlaskit/icon-file-type/glyph/${name}.js`);
    return { name, icon: icon.default };
  }),
).then(newData =>
  newData
    .map(icon => ({
      [icon.name]: { ...fileTypeIconMetadata[icon.name], component: icon.icon },
    }))
    .reduce((acc, b) => ({ ...acc, ...b })),
);

const priorityIconInfo = Promise.all(
  Object.keys(priorityIconMetadata).map(async (name: string) => {
    const icon = await import(`@atlaskit/icon-priority/glyph/${name}.js`);
    return { name, icon: icon.default };
  }),
).then(newData =>
  newData
    .map(icon => ({
      [icon.name]: { ...priorityIconMetadata[icon.name], component: icon.icon },
    }))
    .reduce((acc, b) => ({ ...acc, ...b })),
);

const getAllIcons = async (): Promise<IconsList> => {
  const iconData = await iconIconInfo;
  const objectData = await objectIconInfo;
  const filetypeData = await fileTypeIconInfo;
  const priorityData = await priorityIconInfo;

  return {
    first: {
      componentName: 'divider-icons',
      component: ((() =>
        'exported from @atlaskit/icon') as unknown) as ComponentType<any>,
      keywords: getKeywords(metadata),
      divider: true,
    },
    ...iconData,
    firstTwo: {
      componentName: 'divider-product',
      component: (() =>
        'exported from @atlaskit/logo' as unknown) as ComponentType<any>,
      keywords: getKeywords(logoIcons),
      divider: true,
    },
    ...logoIcons,
    second: {
      componentName: 'divider-object-icons',
      component: (() =>
        'exported from @atlaskit/icon-object' as unknown) as ComponentType<any>,
      keywords: getKeywords(objectIconMetadata),
      divider: true,
    },
    ...objectData,
    third: {
      componentName: 'divider-file-type-icons',
      component: (() =>
        'exported from @atlaskit/icon-file-type' as unknown) as ComponentType<
        any
      >,
      keywords: getKeywords(fileTypeIconMetadata),
      divider: true,
    },
    ...filetypeData,
    forth: {
      componentName: 'divider-priority-icons',
      component: (() =>
        'exported from @atlaskit/icon-priority' as unknown) as ComponentType<
        any
      >,
      keywords: getKeywords(priorityIconMetadata),
      divider: true,
    },
    ...priorityData,
  };
};
const allIconsPromise = getAllIcons();

interface IconType {
  keywords: string[];
  component: ComponentType<any>;
  componentName: string;
  package?: string;
  divider?: boolean;
}

interface LogoMap {
  [key: string]: Pick<IconType, Exclude<keyof IconType, 'component'>>;
}

const getKeywords = (logoMap: LogoMap) =>
  Object.keys(logoMap).reduce(
    (existingKeywords: string[], key) => [
      ...existingKeywords,
      ...logoMap[key].keywords,
    ],
    [],
  );

const IconGridWrapper = styled.div`
  padding: 10px 5px 0;
`;

const IconExplorerGrid = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-top: 10px;
`;

const NoIcons = styled.div`
  margin-top: 10px;
  padding: 10px;
`;

const filterIcons = (icons: IconsList, query: string) => {
  const regex = new RegExp(query);
  return Object.keys(icons)
    .map(index => icons[index])
    .filter(icon =>
      icon.keywords
        .map(keyword => (regex.test(keyword) ? 1 : 0))
        .reduce((allMatches: number, match: number) => allMatches + match, 0),
    );
};

interface State {
  query: string;
  showIcons: boolean;
  allIcons?: IconsList;
}

class IconAllExample extends Component<{}, State> {
  readonly state: State = {
    query: '',
    showIcons: false,
  };

  componentDidMount() {
    allIconsPromise.then(allIcons => this.setState({ allIcons }));
  }

  updateQuery = (query: string) => this.setState({ query, showIcons: true });

  toggleShowIcons = () => this.setState({ showIcons: !this.state.showIcons });

  renderIcons = () => {
    if (!this.state.allIcons) {
      return <div>Loading Icons...</div>;
    }
    const icons: IconType[] = filterIcons(
      this.state.allIcons,
      this.state.query,
    );
    return icons.length ? (
      <IconExplorerGrid>
        {icons.map(icon => (
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
        <Textfield
          value={this.state.query}
          placeholder="Search for an icon..."
          key="Icon search"
          onChange={(event: SyntheticEvent<HTMLInputElement>) =>
            this.updateQuery(event.currentTarget.value)
          }
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
