import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import Button, {
  CustomThemeButtonProps,
} from '@atlaskit/button/custom-theme-button';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors, gridSize } from '@atlaskit/theme';
import FeedbackIcon from '@atlaskit/icon/glyph/feedback';
import { messages } from '../../messages';

interface Props {
  onClick: () => void;
}

// need to add a container around the button so that it lines up with the
// underline of the search input box.
const FeedbackButtonContainer = styled.div`
  margin-top: ${gridSize() * 0.5}px;
`;

// This is a workaround because React.memo does not play well with styled-components
function StyledComponentsButton(props: CustomThemeButtonProps) {
  return <Button {...props} />;
}

const LighterSubtleButton = styled(StyledComponentsButton)`
  /* increase specificity to override default Button styles */
  && {
    color: ${colors.N90};
  }
`;

export default class FeedbackButton extends React.Component<Props> {
  render() {
    return (
      <FeedbackButtonContainer>
        <LighterSubtleButton
          appearance="subtle"
          iconBefore={<FeedbackIcon label="Give feedback" />}
          onClick={this.props.onClick}
        >
          <FormattedMessage {...messages.give_feedback} />
        </LighterSubtleButton>
      </FeedbackButtonContainer>
    );
  }
}
