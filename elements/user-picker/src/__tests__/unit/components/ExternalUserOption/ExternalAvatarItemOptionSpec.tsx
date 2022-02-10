import { mount } from 'enzyme';
import React, { ReactNode } from 'react';
import { ExternalAvatarItemOption } from '../../../../components/ExternalUserOption/ExternalAvatarItemOption';

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

describe('ExternalAvatarItemOption', () => {
  describe('should render AvatarItem with', () => {
    const avatar = 'Avatar';
    const primaryText = 'PrimaryText';
    const secondaryText = 'SecondaryText';
    const sourcesInfoTooltip = 'Sources Info Tooltip';

    it('primary as well as secondary texts', () => {
      const component = mount(
        <ExternalAvatarItemOption
          primaryText={primaryText}
          secondaryText={secondaryText}
          avatar="Avatar"
        />,
      );

      expect(component.text()).toContain(avatar);
      expect(component.text()).toContain(primaryText);
      expect(component.text()).toContain(secondaryText);
      expect(component.text()).not.toContain(sourcesInfoTooltip);
    });

    it('sources info tooltip', () => {
      const component = mount(
        <ExternalAvatarItemOption
          primaryText={primaryText}
          secondaryText={secondaryText}
          avatar="Avatar"
          sourcesInfoTooltip={sourcesInfoTooltip}
        />,
      );

      expect(component.text()).toContain(avatar);
      expect(component.text()).toContain(primaryText);
      expect(component.text()).toContain(secondaryText);
      expect(component.text()).toContain(sourcesInfoTooltip);
    });
  });
});
