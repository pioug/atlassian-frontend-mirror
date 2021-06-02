/** @jsx jsx */
import React, { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import { Checkbox } from '@atlaskit/checkbox';
import { gridSize } from '@atlaskit/theme/constants';

import { ContextualSurvey, OnDismissArgs, SurveyMarshal } from '../src';

export default function BasicUsage() {
  const [showSurvey, setShowSurvey] = useState(false);
  const [hasUserAnswered, setHasUserAnswered] = useState(false);
  const onClick = useCallback(() => {
    setShowSurvey(true);
  }, [setShowSurvey]);

  const onDismiss = useCallback(
    (args: OnDismissArgs) => {
      console.log('dismiss called with', args);
      setShowSurvey(false);
    },
    [setShowSurvey],
  );

  return (
    <React.Fragment>
      <Button appearance="primary" onClick={onClick}>
        Show survey
      </Button>
      <div
        css={css`
          padding-top: ${gridSize()}px;
          font-size: 16px;
        `}
      >
        <Checkbox
          isChecked={hasUserAnswered}
          label="Has the user previously answered the mailing list question?"
          onChange={() =>
            setHasUserAnswered((value: boolean): boolean => !value)
          }
          isDisabled={showSurvey}
          name="checkbox-basic"
        />
      </div>
      <SurveyMarshal shouldShow={showSurvey}>
        {() => (
          <ContextualSurvey
            question="How strongly do you agree or disagree with this statement"
            statement="It is easy to find what I'm looking for in Jira"
            onDismiss={onDismiss}
            getUserHasAnsweredMailingList={() =>
              new Promise((resolve) => {
                console.log(
                  'Discovering if user has previously answered. Result will be:',
                  hasUserAnswered,
                );
                setTimeout(() => resolve(hasUserAnswered), 1000);
              })
            }
            onMailingListAnswer={(answer: boolean) =>
              new Promise((resolve) => {
                console.log('Did sign up to mailing list:', answer);
                setTimeout(resolve, 1000);
              })
            }
            onSubmit={(formValues) =>
              new Promise((resolve) => {
                console.log('submitted value', formValues);
                setTimeout(resolve, 1000);
              })
            }
          />
        )}
      </SurveyMarshal>
    </React.Fragment>
  );
}
