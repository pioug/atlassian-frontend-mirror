import React, { useCallback, useState } from 'react';

import { useGlobals } from '@storybook/api';
import {
  IconButton,
  Icons,
  TooltipLinkList,
  WithTooltip,
} from '@storybook/components';

import { TOOL_ID } from '../constants';
import { Themes } from '../types';

const themeOptions = [
  {
    id: 'none' as Themes,
    title: 'Disable',
    icon: 'cross',
  },
  {
    id: 'light' as Themes,
    title: 'Light theme',
    icon: 'circlehollow',
  },
  {
    id: 'dark' as Themes,
    title: 'Dark theme',
    icon: 'circle',
  },
  {
    id: 'split' as Themes,
    title: 'Side by side',
    icon: 'sidebar',
  },
  {
    id: 'stack' as Themes,
    title: 'Stacked',
    icon: 'bottombar',
  },
];

/**
 * __Tool__
 *
 * ADS Toolbar UI, visible in the topbar of the storybook UI.
 */
const Tool = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [{ adsTheme }, updateGlobals] = useGlobals();

  const setTheme = useCallback(
    (theme: Themes) => updateGlobals({ adsTheme: theme }),
    [updateGlobals],
  );

  return (
    <WithTooltip
      placement="top"
      trigger="click"
      closeOnClick
      onVisibilityChange={setIsVisible}
      tooltip={({ onHide }) => (
        <TooltipLinkList
          links={themeOptions.map(({ id, title, icon }) => {
            const Icon = <Icons style={{ opacity: 1 }} icon={icon as any} />;
            return {
              id,
              title,
              active: adsTheme === id,
              right: Icon,
              onClick: () => {
                setTheme(id);
                onHide();
              },
            };
          })}
        />
      )}
    >
      {/* @ts-ignore */}
      <IconButton
        key={TOOL_ID}
        active={isVisible}
        title="Apply ADS themes to your story"
      >
        <Icons
          icon={
            (themeOptions.find(({ id }) => id === adsTheme)?.icon as any) ||
            'circlehollow'
          }
        />
        {'\xa0ADS Theme'}
      </IconButton>
    </WithTooltip>
  );
};

export default Tool;
