import React, { type ReactNode } from 'react';
import { RendererActionsContextConsumer } from './index';
import type RendererActions from '../../actions/index';

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
