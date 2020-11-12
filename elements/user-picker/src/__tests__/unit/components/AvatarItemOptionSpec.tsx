import { mount } from 'enzyme';
import React from 'react';
import { AvatarItemOption } from '../../../components/AvatarItemOption';

type Lozenge = {
  text: string;
  appearance: 'inprogress';
};

describe('AvatarItemOption', () => {
  describe('should render AvatarItem with', () => {
    const primaryText = 'PrimaryText';
    const secondaryText = 'SecondaryText';
    const sourcesInfoTooltip = 'Sources Info Tooltip';
    const lozenge: Lozenge = {
      text: 'in progress',
      appearance: 'inprogress',
    };

    it('primary as well as secondary texts', () => {
      const primaryText = 'PrimaryText';
      const secondaryText = 'SecondaryText';
      const component = mount(
        <AvatarItemOption
          primaryText={primaryText}
          secondaryText={secondaryText}
          avatar="Avatar"
        />,
      );

      expect(component.text()).toContain(primaryText);
      expect(component.text()).toContain(secondaryText);
    });

    describe('sources info tooltip but without lozenge', () => {
      it('when lozenge is not present', () => {
        const component = mount(
          <AvatarItemOption
            primaryText={primaryText}
            secondaryText={secondaryText}
            sourcesInfoTooltip={sourcesInfoTooltip}
            avatar="Avatar"
          />,
        );

        expect(component.text()).toContain(sourcesInfoTooltip);
        expect(component.text()).not.toContain(lozenge.text);
      });

      it('even when lozenge is present', () => {
        const component = mount(
          <AvatarItemOption
            primaryText={primaryText}
            secondaryText={secondaryText}
            sourcesInfoTooltip={sourcesInfoTooltip}
            lozenge={lozenge}
            avatar="Avatar"
          />,
        );

        expect(component.text()).toContain(sourcesInfoTooltip);
        expect(component.text()).not.toContain(lozenge.text);
      });
    });

    it(
      'with lozenge and without sourcesInfoTooltip ' +
        'when lozenge is present but sourcesInfoTooltip is not present',
      () => {
        const component = mount(
          <AvatarItemOption
            primaryText={primaryText}
            secondaryText={secondaryText}
            lozenge={lozenge}
            avatar="Avatar"
          />,
        );

        expect(component.text()).not.toContain(sourcesInfoTooltip);
        expect(component.text()).toContain(lozenge.text);
      },
    );
  });
});
