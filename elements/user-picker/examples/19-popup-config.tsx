import React, { useState } from 'react';
import { Placement } from '@atlaskit/popper';
import styled from 'styled-components';
import Slider from '@atlaskit/field-range';
import Select from '@atlaskit/select';
import { PopupUserPicker } from '../src';

export const MenuPlaceholder = styled.div`
  min-width: ${12}px;
  visibility: ${(props) => (props ? 'visible' : 'hidden')};
  margin-left: ${4}px;
  position: relative;
`;

const SelectContainer = styled.div`
  width: 250px;
  padding-left: 10px;
`;

const OptionContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 300px;
  justify-content: space-evenly;
`;

const PopupContainer = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

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
              width={500}
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
              width={500}
            />
          </SelectContainer>
        </OptionContainer>
        <OptionContainer>
          <text>
            <div>X offset: </div>
            {state.xOffset}
          </text>
          <Slider
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
          <Slider
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
        />
      </PopupContainer>
    </Container>
  );
};
export default Example;
