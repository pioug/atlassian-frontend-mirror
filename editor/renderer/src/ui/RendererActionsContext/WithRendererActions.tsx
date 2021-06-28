import React, { ReactNode } from 'react';
import { RendererActionsContextConsumer } from './index';
import RendererActions from '../../actions/index';

export interface WithRendererActionsProps {
  render(actions: RendererActions): ReactNode | null;
}

export function WithRendererActions({ render }: WithRendererActionsProps) {
  return (
    <RendererActionsContextConsumer>
      {(actions) => render(actions)}
    </RendererActionsContextConsumer>
  );
}
