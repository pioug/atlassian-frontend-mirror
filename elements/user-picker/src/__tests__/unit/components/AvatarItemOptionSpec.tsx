import { mount } from 'enzyme';
import React, { ReactNode } from 'react';
import { LozengeProps } from '../../../types';
import { AvatarItemOption } from '../../../components/AvatarItemOption';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';

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
    const lozenge: LozengeProps = {
      text: 'in progress',
      appearance: 'inprogress',
    };
    const lozengeHtml: ReactNode = (
      <ChevronRightIcon
        testId="lozenge-chevron-right-icon"
        label="chevron-right"
      />
    );

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
      expect(component.text()).not.toContain(lozenge.text);
    });

    it('with lozenge when lozenge is present', () => {
      const component = mount(
        <AvatarItemOption
          primaryText={primaryText}
          secondaryText={secondaryText}
          lozenge={lozenge}
          avatar="Avatar"
        />,
      );

      expect(component.text()).toContain(lozenge.text);
    });

    it('with html lozenge when lozenge is present', async () => {
      const component = mount(
        <AvatarItemOption
          primaryText={primaryText}
          secondaryText={secondaryText}
          lozenge={lozengeHtml}
          avatar="Avatar"
        />,
      );

      expect(component.html()).toContain('lozenge-chevron-right-icon');
    });
  });
});
