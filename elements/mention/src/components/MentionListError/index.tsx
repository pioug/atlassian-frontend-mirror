import React from 'react';
import { type HttpError } from '../../api/MentionResource';
import {
  DefaultAdvisedAction,
  DefaultHeadline,
  DifferentText,
  type Formatter,
  LoginAgain,
} from '../../util/i18n';
import { GenericErrorIllustration } from './GenericErrorIllustration';
import {
  MentionListAdviceStyle,
  MentionListErrorHeadlineStyle,
  MentionListErrorStyle,
} from './styles';

export interface Props {
  error?: Error;
}

const advisedActionMessages: {
  [key: string]: Formatter;
} = {
  '401': LoginAgain,
  '403': DifferentText,
  default: DefaultAdvisedAction,
};

export default class MentionListError extends React.PureComponent<Props, {}> {
  /**
   * Translate the supplied Error into a message suitable for display in the MentionList.
   *
   * @param error the error to be displayed
   */
  private static getAdvisedActionMessage(error: Error | undefined): Formatter {
    if (error && error.hasOwnProperty('statusCode')) {
      const httpError = error as HttpError;
      return (
        advisedActionMessages[httpError.statusCode.toString()] ||
        advisedActionMessages.default
      );
    }
    return advisedActionMessages.default;
  }

  render() {
    const { error } = this.props;
    const ErrorMessage = MentionListError.getAdvisedActionMessage(error);
    return (
      <MentionListErrorStyle>
        <GenericErrorIllustration />
        <MentionListErrorHeadlineStyle>
          <DefaultHeadline />
        </MentionListErrorHeadlineStyle>
        <MentionListAdviceStyle>
          <ErrorMessage />
        </MentionListAdviceStyle>
      </MentionListErrorStyle>
    );
  }
}
