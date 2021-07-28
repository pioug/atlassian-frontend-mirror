/** @jsx jsx */
import React, {
  useState,
  SyntheticEvent,
  ComponentType,
  useCallback,
  useEffect,
} from 'react';
import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import Textfield from '@atlaskit/textfield';
import objectIconMetadata from '@atlaskit/icon-object/metadata';
import fileTypeIconMetadata from '@atlaskit/icon-file-type/metadata';
import priorityIconMetadata from '@atlaskit/icon-priority/metadata';

import metadata from '../src/metadata';
import IconExplorerCell from './utils/icon-explorer-cell';
import logoIcons from '../utils/logo-icons';

type IconsList = Record<string, IconData>;

// WARNING
// It is going to be very tempting to move these into some higher level abstraction
// They need to live at the root because of the dynamic imports so webpack resolves
// them correctly

const iconIconInfo = Promise.all(
  Object.keys(metadata).map(async (name: string) => {
    const icon = await import(`../glyph/${name}.js`);
    return { name, icon: icon.default };
  }),
).then((newData) =>
  newData
    .map((icon) => ({
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
).then((newData) =>
  newData
    .map((icon) => ({
      [icon.name]: { ...objectIconMetadata[icon.name], component: icon.icon },
    }))
    .reduce((acc, b) => ({ ...acc, ...b })),
);
const fileTypeIconInfo = Promise.all(
  Object.keys(fileTypeIconMetadata).map(async (name: string) => {
    const icon = await import(`@atlaskit/icon-file-type/glyph/${name}.js`);
    return { name, icon: icon.default };
  }),
).then((newData) =>
  newData
    .map((icon) => ({
      [icon.name]: { ...fileTypeIconMetadata[icon.name], component: icon.icon },
    }))
    .reduce((acc, b) => ({ ...acc, ...b })),
);

const priorityIconInfo = Promise.all(
  Object.keys(priorityIconMetadata).map(async (name: string) => {
    const icon = await import(`@atlaskit/icon-priority/glyph/${name}.js`);
    return { name, icon: icon.default };
  }),
).then((newData) =>
  newData
    .map((icon) => ({
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
interface IconData {
  keywords: string[];
  component: ComponentType<any>;
  componentName: string;
  package?: string;
  divider?: boolean;
}

interface LogoMap {
  [key: string]: Pick<IconData, Exclude<keyof IconData, 'component'>>;
}

const getKeywords = (logoMap: LogoMap) =>
  Object.keys(logoMap).reduce(
    (existingKeywords: string[], key) => [
      ...existingKeywords,
      ...logoMap[key].keywords,
    ],
    [],
  );

const gridWrapperStyles = css({
  padding: '10px 5px 0',
});

const iconExplorerGridStyles = css({
  display: 'flex',
  marginTop: 10,
  justifyContent: 'flex-start',
  flexDirection: 'row',
  flexWrap: 'wrap',
});

const noIconsStyles = css({
  marginTop: 10,
  padding: 10,
});

const filterIcons = (icons: IconsList, query: string) => {
  const regex = new RegExp(query);
  return Object.keys(icons)
    .map((index) => icons[index])
    .filter((icon) =>
      icon.keywords
        .map((keyword) => (regex.test(keyword) ? 1 : 0))
        .reduce((allMatches: number, match: number) => allMatches + match, 0),
    );
};

const allIconsPromise = getAllIcons();

const IconAllExample: React.FC = () => {
  const [allIcons, setAllIcons] = useState<IconsList>();
  const [query, setQuery] = useState('');
  const [areIconsShowing, setIconsShowing] = useState(false);

  useEffect(() => {
    allIconsPromise.then(setAllIcons);
  }, [setAllIcons]);

  const updateQuery = useCallback(
    (newQuery: string) => {
      setQuery(newQuery);
      setIconsShowing(true);
    },
    [setQuery, setIconsShowing],
  );

  const renderIcons = () => {
    if (!allIcons) {
      return <div>Loading Icons...</div>;
    }
    const icons: IconData[] = filterIcons(allIcons, query);
    return icons.length ? (
      <div css={iconExplorerGridStyles}>
        {icons.map((icon) => (
          <IconExplorerCell {...icon} key={icon.componentName} />
        ))}
      </div>
    ) : (
      <div
        css={noIconsStyles}
      >{`Sorry, we couldn't find any icons matching "${query}".`}</div>
    );
  };

  return (
    <div>
      <Textfield
        value={query}
        placeholder="Search for an icon..."
        key="Icon search"
        onChange={(event: SyntheticEvent<HTMLInputElement>) =>
          updateQuery(event.currentTarget.value)
        }
      />
      <div css={gridWrapperStyles}>
        <p>
          <Button
            appearance="subtle-link"
            onClick={() => setIconsShowing((old) => !old)}
            spacing="none"
          >
            {areIconsShowing ? 'Hide icons' : 'Show all icons'}
          </Button>
        </p>
        {areIconsShowing ? renderIcons() : null}
      </div>
    </div>
  );
};

export default IconAllExample;
