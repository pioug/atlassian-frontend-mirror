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
		sourceVisible: this.props.sourceVisible !== undefined ? this.props.sourceVisible : false,
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
			this.props.sourceVisible === undefined ? this.state.sourceVisible : propsSourceVisible;
		const { isHover } = this.state;

		const toggleLabel = sourceVisible ? 'Hide Code Snippet' : 'Show Code Snippet';

		const state = isHover ? 'hover' : 'normal';
		const mode = sourceVisible ? 'open' : 'closed';

		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			<Wrapper className="AKExampleWrapper" state={state} mode={mode}>
				<Toggle
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
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
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					<CodeWrapper className="AKExampleCodeWrapper">
						<CodeBlock
							text={packageName ? replaceSrc(source, packageName) : source}
							language={language}
							showLineNumbers={false}
							highlight={highlight}
						/>
					</CodeWrapper>
				) : null}
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
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

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
const Wrapper = styled.div((props) => ({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundColor: exampleBackgroundColor[props.mode](props),
	borderRadius: '5px',
	boxSizing: 'border-box',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	color: toggleColor(props),
	marginTop: '20px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	padding: `0 ${gridSize()}px ${gridSize()}px`,
	transition: `background-color ${TRANSITION_DURATION}`,
	maxWidth: 'calc(100vw - 4rem)',
}));

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-styled -- Ignored via go/DSP-18766
export const Toggle = styled.div({
	alignItems: 'center',
	cursor: 'pointer',
	display: 'flex',
	justifyContent: 'space-between',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	padding: `${gridSize()}px`,
	transition: `color ${TRANSITION_DURATION}, fill ${TRANSITION_DURATION}`,
});

// NOTE: use of important necessary to override element targeted headings
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const ToggleTitle = styled.h4((props) => ({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	color: `${toggleColor(props)} !important`,
	margin: 0,
}));

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
const Showcase = styled.div((props) => ({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundColor: colors.background(props),
	borderRadius: '3px',
	boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	padding: `${gridSize()}px`,
}));

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- Ignored via go/DSP-18766
const CodeWrapper = styled.div({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	margin: `0 0 ${gridSize()}px`,
});
