import React, { createContext, useContext, useMemo, useState } from 'react';

import { LinkCreatePlugin } from '../../common/types';

type LinkCreatePluginsContextValue = {
  activePlugin: LinkCreatePlugin | null;
} | null;

const LinkCreatePluginsContext =
  createContext<LinkCreatePluginsContextValue>(null);

type LinkCreatePluginsProviderProps = {
  /**
   * The list of plugins provided as a prop to Link Create component
   */
  plugins: LinkCreatePlugin[];
  /**
   * The entity key as provided as prop to link create which controls the initially active plugin
   */
  entityKey: string;
  children:
    | React.ReactNode
    | ((value: LinkCreatePluginsContextValue) => React.ReactNode);
};

export const LinkCreatePluginsProvider = ({
  plugins,
  entityKey: propEntityKey,
  children,
}: LinkCreatePluginsProviderProps) => {
  const [entityKey] = useState(propEntityKey);

  const value = useMemo(
    () => ({
      activePlugin: plugins.find(plugin => plugin.key === entityKey) ?? null,
    }),
    [entityKey, plugins],
  );

  return (
    <LinkCreatePluginsContext.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </LinkCreatePluginsContext.Provider>
  );
};

export const useLinkCreatePlugins = () => {
  const value = useContext(LinkCreatePluginsContext);

  if (!value) {
    throw new Error(
      'useLinkCreatePlugins used outside of LinkCreatePluginsProvider',
    );
  }

  return value;
};
