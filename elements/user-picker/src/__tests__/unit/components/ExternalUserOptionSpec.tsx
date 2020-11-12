import * as colors from '@atlaskit/theme/colors';
import { shallow } from 'enzyme';
import React from 'react';
import {
  AvatarItemOption,
  TextWrapper,
} from '../../../components/AvatarItemOption';
import { SizeableAvatar } from '../../../components/SizeableAvatar';
import {
  ExternalUserOption,
  ExternalUserOptionProps,
  EmailDomainWrapper,
  SourceWrapper,
  SourcesTooltipContainer,
  ImageContainer,
} from '../../../components/ExternalUserOption';
import { GoogleIcon } from '../../../components/assets/google';
import Tooltip from '@atlaskit/tooltip';
import { N200 } from '@atlaskit/theme/colors';
import EditorPanelIcon from '@atlaskit/icon/glyph/editor/panel';
import { messages } from '../../../components/i18n';
import { FormattedMessage } from 'react-intl';
import { UserSource } from '../../../../src/types';

describe('ExternalUser Option', () => {
  const source = 'google';
  const user = {
    id: 'abc-123',
    name: 'Jace Beleren',
    email: 'jbeleren@email.com',
    avatarUrl: 'http://avatars.atlassian.com/jace.png',
    lozenge: 'WORKSPACE',
    sources: [source] as UserSource[],
  };
  const shallowOption = (props: Partial<ExternalUserOptionProps> = {}) =>
    shallow<ExternalUserOption>(
      <ExternalUserOption
        user={user}
        status="approved"
        isSelected={false}
        {...props}
      />,
    );

  const expectedPrimaryText = (
    <TextWrapper key="name" color={colors.N800}>
      {user.name}
    </TextWrapper>
  );
  const expectedSecondaryText = (
    <TextWrapper color={colors.N200}>
      {user.email.split('@')[0]}
      <EmailDomainWrapper>{'@' + user.email.split('@')[1]}</EmailDomainWrapper>
    </TextWrapper>
  );
  const expectedSizeableAvatar = (
    <SizeableAvatar
      appearance="big"
      src="http://avatars.atlassian.com/jace.png"
      presence="approved"
      name="Jace Beleren"
    />
  );

  const expectedSourcesInfoTooltip = (
    <Tooltip
      position={'right-start'}
      content={
        <React.Fragment>
          <span>
            <FormattedMessage {...messages.externalUserSourcesHeading} />
          </span>
          <SourcesTooltipContainer>
            {[
              <SourceWrapper key={source}>
                <ImageContainer>
                  <GoogleIcon />
                </ImageContainer>
                <span>
                  <FormattedMessage {...messages.googleProvider} />
                </span>
              </SourceWrapper>,
            ]}
          </SourcesTooltipContainer>
        </React.Fragment>
      }
    >
      <EditorPanelIcon label="" size="large" primaryColor={N200} />
    </Tooltip>
  );

  it(
    'should render ExternalUserOption component with ' +
      'secondary text and tooltip elements when sources collection is not empty',
    () => {
      const component = shallowOption();
      const avatarItemOption = component.find(AvatarItemOption);
      expect(avatarItemOption.props()).toMatchObject({
        avatar: expectedSizeableAvatar,
        primaryText: expectedPrimaryText,
        secondaryText: expectedSecondaryText,
      });
      expect(avatarItemOption.props().sourcesInfoTooltip).toStrictEqual(
        expectedSourcesInfoTooltip,
      );
    },
  );

  it('should not render tooltip elements when sources collection is empty', () => {
    const userWithEmptySources = {
      ...user,
      sources: [],
    };
    const component = shallowOption({ user: userWithEmptySources });
    const avatarItemOption = component.find(AvatarItemOption);
    expect(avatarItemOption.props()).toMatchObject({
      avatar: expectedSizeableAvatar,
      primaryText: expectedPrimaryText,
      secondaryText: expectedSecondaryText,
      sourcesInfoTooltip: undefined,
    });
  });
});
