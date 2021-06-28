import React from 'react';
import styled from 'styled-components';
import EditorCollapseIcon from '@atlaskit/icon/glyph/editor/collapse';
import EditorExpandIcon from '@atlaskit/icon/glyph/editor/expand';
import {
  LOCALSTORAGE_defaultMode,
  FULL_WIDTH_MODE,
  DEFAULT_MODE,
} from './example-constants';
import { EditorAppearance } from '../src/types';

const ToggleWrapper = styled.button`
  cursor: pointer;
  background: none;
  border: none;
`;

interface Props {
  appearance: EditorAppearance;
  onFullWidthChange: (fullWidthMode: boolean) => void;
}

interface State {
  fullWidthMode: boolean;
}

export default class FullWidthToggle extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      fullWidthMode: props.appearance === FULL_WIDTH_MODE,
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.appearance !== this.props.appearance) {
      this.setState(() => ({
        fullWidthMode: this.props.appearance === FULL_WIDTH_MODE,
      }));
    }
  }

  private toggleFullWidthMode = (
    e: React.SyntheticEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    this.setState(
      (prevState) => ({ fullWidthMode: !prevState.fullWidthMode }),
      () => {
        localStorage.setItem(
          LOCALSTORAGE_defaultMode,
          this.state.fullWidthMode ? FULL_WIDTH_MODE : DEFAULT_MODE,
        );
        this.props.onFullWidthChange(this.state.fullWidthMode);
      },
    );
  };

  render() {
    return (
      <ToggleWrapper onClick={this.toggleFullWidthMode}>
        {this.state.fullWidthMode ? (
          <EditorCollapseIcon label="Make page fixed-width" />
        ) : (
          <EditorExpandIcon label="Make page full-width" />
        )}
      </ToggleWrapper>
    );
  }
}
