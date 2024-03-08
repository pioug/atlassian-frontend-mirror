import React, { createContext } from 'react';
import type { Position } from './types';
import type { AnnotationProviders } from '@atlaskit/editor-common/types';
import type { AnnotationId, AnnotationMarkStates } from '@atlaskit/adf-schema';

export type AnnotationsDraftContextWrapperChildrenProps = {
  applyAnnotationDraftAt: (position: Position) => void;
  clearAnnotationDraft: () => void;
};

export type RenderCallbackType = (
  props: React.PropsWithChildren<AnnotationsDraftContextWrapperChildrenProps>,
) => React.ReactNode;

type Props = {
  children: RenderCallbackType;
};

type State = {
  position: Position | null;
};

export const AnnotationsDraftContext = createContext<Position | null>(null);
export const ProvidersContext = createContext<
  AnnotationProviders | null | undefined
>(null);
export const InlineCommentsStateContext = createContext<
  Record<AnnotationId, AnnotationMarkStates | null>
>({});

export class AnnotationsDraftContextWrapper extends React.Component<
  Props,
  State
> {
  state = {
    position: null,
  };

  render() {
    const { children } = this.props;
    const { position } = this.state;
    const applyAnnotationDraftAt = this.applyAnnotationDraftAt;
    const clearAnnotationDraft = this.clearAnnotationDraft;

    return (
      <AnnotationsDraftContext.Provider value={position}>
        {children({ applyAnnotationDraftAt, clearAnnotationDraft })}
      </AnnotationsDraftContext.Provider>
    );
  }

  applyAnnotationDraftAt = (nextPosition: Position) => {
    const { position } = this.state;

    if (!position) {
      this.setState({
        position: nextPosition,
      });
    }
  };

  clearAnnotationDraft = () => {
    this.setState({
      position: null,
    });
  };
}
