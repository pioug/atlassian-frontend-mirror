import React, { createContext } from 'react';
import { Position } from './types';

type ChildrenProps = {
  applyAnnotationDraftAt: (position: Position) => void;
  clearAnnotationDraft: () => void;
};

type Props = {
  children: React.FC<ChildrenProps>;
};

type State = {
  position: Position | null;
};

export const AnnotationsDraftContext = createContext<Position | null>(null);

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
