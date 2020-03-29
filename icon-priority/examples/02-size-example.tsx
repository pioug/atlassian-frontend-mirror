import React, { Component, ReactNode } from 'react';
import styled from 'styled-components';
import Button, { ButtonGroup } from '@atlaskit/button';

import PriorityTrivial from '../glyph/priority-trivial';
import PriorityLowest from '../glyph/priority-lowest';
import PriorityLow from '../glyph/priority-low';
import PriorityMinor from '../glyph/priority-minor';
import PriorityMidium from '../glyph/priority-medium';
import PriorityMajor from '../glyph/priority-major';
import PriorityCritical from '../glyph/priority-critical';
import PriorityBlocker from '../glyph/priority-blocker';

const IconRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 8px;
  min-height: 60px;
`;

const IconWrapper = styled.span`
  margin: 4px;
`;

const demoIcons = [
  PriorityTrivial,
  PriorityLowest,
  PriorityLow,
  PriorityMinor,
  PriorityMidium,
  PriorityMajor,
  PriorityCritical,
  PriorityBlocker,
];

const sizes: Sizes[] = ['small', 'medium', 'large', 'xlarge'];

type Sizes = 'small' | 'medium' | 'large' | 'xlarge';

class IconSizeExample extends Component<{}, { size: Sizes }> {
  state = {
    size: 'medium' as Sizes,
  };

  updateSize = (s: Sizes) => this.setState({ size: s });

  renderButtons = (): ReactNode =>
    sizes.map(s => (
      <div style={{ marginRight: 4 }}>
        <Button
          isSelected={s === this.state.size}
          key={s}
          onClick={() => this.updateSize(s)}
        />
        {s}
      </div>
    ));

  render() {
    return (
      <div>
        <ButtonGroup>{this.renderButtons()}</ButtonGroup>
        <IconRow>
          {demoIcons.map((Icon, i) => (
            <IconWrapper key={i}>
              <Icon label={`Icon ${i}`} size={this.state.size} />
            </IconWrapper>
          ))}
        </IconRow>
      </div>
    );
  }
}

export default IconSizeExample;
