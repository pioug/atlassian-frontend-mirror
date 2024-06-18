import { type Placement } from '@atlaskit/popper';
import Range from '@atlaskit/range';
import Select from '@atlaskit/select';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import React, { useState } from 'react';
import { IntlProvider } from 'react-intl-next';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import { PopupUserPicker } from '../src';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const MenuPlaceholder = styled.div((props) => ({
	minWidth: token('space.150', '12px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	visibility: props ? 'visible' : 'hidden',
	marginLeft: token('space.050', '4px'),
	position: 'relative',
}));

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const SelectContainer = styled.div({
	width: '250px',
	paddingLeft: token('space.150', '12px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const OptionContainer = styled.div({
	display: 'flex',
	flexDirection: 'row',
	width: '100%',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const OptionsContainer = styled.div({
	display: 'flex',
	flexDirection: 'column',
	width: '300px',
	height: '300px',
	justifyContent: 'space-evenly',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const PopupContainer = styled.div({
	width: '100%',
	height: '300px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Container = styled.div({
	display: 'flex',
	flexDirection: 'row',
});

type Boundary = 'scrollParent' | 'viewport';

const boundariesElementOptions: Boundary[] = ['scrollParent', 'viewport'];

const placementOptions: Placement[] = [
	'top',
	'top-start',
	'top-end',
	'bottom',
	'bottom-start',
	'bottom-end',
	'right',
	'right-start',
	'right-end',
	'left-start',
	'left-end',
	'left',
];

type PopupState = {
	containerRef?: HTMLDivElement;
	shouldFlip: boolean;
	xOffset: number;
	yOffset: number;
	placement: {
		label: string;
		value: Placement;
	};
	boundariesElement: {
		label: string;
		value: Boundary;
	};
};

const getSelectItems = <Option,>(options: Option[]) =>
	options.map((option) => ({
		label: option,
		value: option,
	}));

const Example = () => {
	let [state, setState] = useState<PopupState>({
		containerRef: undefined,
		shouldFlip: true,
		xOffset: 0,
		yOffset: 0,
		placement: {
			label: 'bottom-end',
			value: 'bottom-end' as Placement,
		},
		boundariesElement: {
			label: 'window',
			value: 'window' as Boundary,
		},
	});

	return (
		<IntlProvider locale="en">
			<Container>
				<OptionsContainer>
					<OptionContainer>
						<text>Placement:</text>
						<SelectContainer>
							<Select
								options={getSelectItems<Placement>(placementOptions)}
								defaultValue={state.placement}
								onChange={(value) =>
									value &&
									setState({
										...state,
										placement: value as {
											label: string;
											value: Placement;
										},
									})
								}
								name="placement"
								placeholder="Placement"
							/>
						</SelectContainer>
					</OptionContainer>
					<OptionContainer>
						<text>Boundaries Element:</text>
						<SelectContainer>
							<Select
								options={getSelectItems(boundariesElementOptions)}
								defaultValue={state.boundariesElement}
								onChange={(value) =>
									value &&
									setState({
										...state,
										boundariesElement: value as {
											label: string;
											value: Boundary;
										},
									})
								}
								name="placement"
								placeholder="Placement"
							/>
						</SelectContainer>
					</OptionContainer>
					<OptionContainer>
						<text>
							<div>X offset: </div>
							{state.xOffset}
						</text>
						<Range
							value={state.xOffset}
							min={0}
							max={500}
							onChange={(value: number) => setState({ ...state, xOffset: value })}
						/>
					</OptionContainer>
					<OptionContainer>
						<text>
							<div>Y offset: </div>
							{state.yOffset}
						</text>
						<Range
							value={state.yOffset}
							min={0}
							max={500}
							onChange={(value: number) => setState({ ...state, yOffset: value })}
						/>
					</OptionContainer>
					<div>
						<input
							checked={Boolean(state.shouldFlip)}
							id="shouldFlip"
							onChange={(e) => {
								// @ts-ignore
								setState({
									...state,
									shouldFlip: !state.shouldFlip,
								});
							}}
							type="checkbox"
						/>
						<label htmlFor="should flip">should flip</label>
					</div>
				</OptionsContainer>

				<PopupContainer>
					<ExampleWrapper>
						{({ options, onInputChange, onSelection }) => (
							<PopupUserPicker
								popupTitle="Assignee"
								fieldId="example"
								target={({ ref }) => {
									return <button ref={ref}>Target</button>;
								}}
								width={200}
								placement={state.placement.value}
								shouldFlip={true}
								offset={[state.xOffset, state.yOffset]}
								boundariesElement={state.boundariesElement.value}
								options={options}
								onInputChange={onInputChange}
								onSelection={onSelection}
							/>
						)}
					</ExampleWrapper>
				</PopupContainer>
			</Container>
		</IntlProvider>
	);
};
export default Example;
