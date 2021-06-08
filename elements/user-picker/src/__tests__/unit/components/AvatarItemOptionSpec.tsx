import { mount } from 'enzyme';
import React, { ReactNode } from 'react';
import { LozengeProps } from '../../../types';
import { AvatarItemOption } from '../../../components/AvatarItemOption';

jest.mock('@atlaskit/tooltip', () => ({
  ...jest.requireActual<any>('@atlaskit/tooltip'),
  __esModule: true,
  default: ({
    children,
    content,
  }: {
    children: ReactNode;
    content: string;
  }) => (
    <div>
      <div>{children}</div>
      <div>{content}</div>
    </div>
  ),
}));

describe('AvatarItemOption', () => {
  describe('should render AvatarItem with', () => {
    const primaryText = 'PrimaryText';
    const secondaryText = 'SecondaryText';
    const sourcesInfoTooltip = 'Sources Info Tooltip';
    const lozenge: LozengeProps = {
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

    it(
      'with lozenge and lozenge tooltip but without sourcesInfoTooltip ' +
        'when lozenge with its tooltip is present but sourcesInfoTooltip is not present',
      () => {
        const lozengeWithTooltip: LozengeProps = {
          text: 'Guest',
          appearance: 'new',
          tooltip: 'Confluence Guest lozenges have a tooltip',
        };
        const component = mount(
          <AvatarItemOption
            primaryText={primaryText}
            secondaryText={secondaryText}
            lozenge={lozengeWithTooltip}
            avatar="Avatar"
          />,
        );

        expect(component.text()).not.toContain(sourcesInfoTooltip);
        expect(component.text()).toContain(lozengeWithTooltip.text);
        expect(component.text()).toContain(lozengeWithTooltip.tooltip);
      },
    );
  });
});
