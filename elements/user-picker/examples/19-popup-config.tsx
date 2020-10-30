import React from 'react';
import { Placement } from '@atlaskit/popper';
import styled from 'styled-components';
import Slider from '@atlaskit/field-range';
import Select from '@atlaskit/select';
import { PopupUserPicker } from '../src';

export const MenuPlaceholder = styled.div`
  min-width: ${12}px;
  visibility: ${props => (props ? 'visible' : 'hidden')};
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

const getSelectItems = <Option,>(options: Option[]) =>
  options.map(option => ({
    label: option,
    value: option,
  }));

export default class Example extends React.Component<{}> {
  state = {
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
  };

  setContainerRef = (ref: HTMLDivElement | null) => {
    if (!this.state.containerRef) {
      this.setState({ containerRef: ref });
    }
  };

  render() {
    return (
      <Container>
        <OptionsContainer>
          <OptionContainer>
            <text>Placement:</text>
            <SelectContainer>
              <Select
                options={getSelectItems<Placement>(placementOptions)}
                defaultValue={this.state.placement}
                onChange={value => this.setState({ placement: value })}
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
                defaultValue={this.state.boundariesElement}
                onChange={value => this.setState({ boundariesElement: value })}
                name="placement"
                placeholder="Placement"
                width={500}
              />
            </SelectContainer>
          </OptionContainer>
          <OptionContainer>
            <text>X offset: {this.state.xOffset}</text>
            <Slider
              value={this.state.xOffset}
              min={0}
              max={500}
              onChange={(value: number) => this.setState({ xOffset: value })}
            />
          </OptionContainer>
          <OptionContainer>
            <text>Y offset: {this.state.yOffset}</text>
            <Slider
              value={this.state.yOffset}
              min={0}
              max={500}
              onChange={(value: number) => this.setState({ yOffset: value })}
            />
          </OptionContainer>
          <div>
            <input
              checked={Boolean(this.state.shouldFlip)}
              id="shouldFlip"
              onChange={e => {
                // @ts-ignore
                this.setState({
                  shouldFlip: !this.state.shouldFlip,
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
            placement={this.state.placement.value}
            shouldFlip={true}
            offset={[this.state.xOffset, this.state.yOffset]}
            boundariesElement={this.state.boundariesElement.value}
          />
        </PopupContainer>
      </Container>
    );
  }
}
