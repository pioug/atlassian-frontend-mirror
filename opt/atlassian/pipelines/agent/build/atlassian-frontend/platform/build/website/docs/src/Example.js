/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import { colors, gridSize, themed } from '@atlaskit/theme';
import CodeBlock from '@atlaskit/code/block';
import ToggleIcon from '@atlaskit/icon/glyph/code';
import ErrorBoundary from './ErrorBoundary';
import replaceSrc from './replaceSrc';

export default class Example extends React.Component {
  static defaultProps = {
    language: 'javascript',
    highlight: '',
  };

  state = {
    sourceVisible:
      this.props.sourceVisible !== undefined ? this.props.sourceVisible : false,
    isHover: false,
  };

  toggleSource = () => {
    if (this.props.onToggleSource) {
      this.props.onToggleSource();
    } else {
      this.setState({ sourceVisible: !this.state.sourceVisible });
    }
  };

  onError = (error, info) => {
    console.error(error);
    console.error(info);
  };

  render() {
    const {
      Component,
      source,
      language,
      title,
      packageName,
      highlight,
      sourceVisible: propsSourceVisible,
    } = this.props;

    // Support controlled and uncontrolled API
    const sourceVisible =
      this.props.sourceVisible === undefined
        ? this.state.sourceVisible
        : propsSourceVisible;
    const { isHover } = this.state;

    const toggleLabel = sourceVisible
      ? 'Hide Code Snippet'
      : 'Show Code Snippet';

    const state = isHover ? 'hover' : 'normal';
    const mode = sourceVisible ? 'open' : 'closed';

    return (
      <Wrapper className="AKExampleWrapper" state={state} mode={mode}>
        <Toggle
          className="AKExampleToggle"
          onClick={this.toggleSource}
          onMouseOver={() => this.setState({ isHover: true })}
          onMouseOut={() => this.setState({ isHover: false })}
          title={toggleLabel}
          mode={mode}
        >
          <ToggleTitle mode={mode}>{title}</ToggleTitle>
          <ToggleIcon label={toggleLabel} />
        </Toggle>

        {sourceVisible ? (
          <CodeWrapper className="AKExampleCodeWrapper">
            <CodeBlock
              text={packageName ? replaceSrc(source, packageName) : source}
              language={language}
              showLineNumbers={false}
              highlight={highlight}
            />
          </CodeWrapper>
        ) : null}
        <Showcase className="AKExampleShowcase">
          <ErrorBoundary onError={this.onError}>
            <Component />
          </ErrorBoundary>
        </Showcase>
      </Wrapper>
    );
  }
}

const TRANSITION_DURATION = '200ms';

const exampleBackgroundColor = {
  open: themed('state', {
    normal: { light: colors.N30, dark: colors.N700 },
    hover: { light: colors.N40, dark: colors.N600 },
  }),
  closed: themed('state', {
    normal: { light: colors.N20, dark: colors.DN50 },
    hover: { light: colors.N40, dark: colors.DN60 },
  }),
};
const toggleColor = themed('mode', {
  closed: { light: colors.N600, dark: colors.DN100 },
  open: { light: colors.N600, dark: colors.DN100 },
});

const Wrapper = styled.div`
  background-color: ${p => exampleBackgroundColor[p.mode]};
  border-radius: 5px;
  box-sizing: border-box;
  color: ${toggleColor};
  margin-top: 20px;
  padding: 0 ${gridSize}px ${gridSize}px;
  transition: background-color ${TRANSITION_DURATION};
  max-width: calc(100vw - 4rem);
`;

export const Toggle = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: ${gridSize}px;
  transition: color ${TRANSITION_DURATION}, fill ${TRANSITION_DURATION};
`;

// NOTE: use of important necessary to override element targeted headings
export const ToggleTitle = styled.h4`
  color: ${toggleColor} !important;
  margin: 0;
`;

const Showcase = styled.div`
  background-color: ${colors.background};
  border-radius: 3px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  padding: ${gridSize}px;
`;

const CodeWrapper = styled.div`
  margin: 0 0 ${gridSize}px;
`;
