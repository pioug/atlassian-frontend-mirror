import React, { PropsWithChildren, useMemo } from 'react';
import RendererActions from '../../actions/index';

export const RendererContext = React.createContext(new RendererActions());

type RendererActionsContextProps = PropsWithChildren<{
  context?: RendererActions;
}>;

export function RendererActionsContext({
  children,
  context,
}: RendererActionsContextProps) {
  const actions = useMemo(() => new RendererActions(true), []);

  return (
    <RendererContext.Provider value={context || actions}>
      {React.Children.only(children)}
    </RendererContext.Provider>
  );
}

export const RendererActionsContextConsumer = RendererContext.Consumer;
