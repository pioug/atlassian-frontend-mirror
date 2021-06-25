import React, { SyntheticEvent, useState } from 'react';

import { css } from '@emotion/core';

import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { RadioGroup } from '@atlaskit/radio';
import Spinner from '@atlaskit/spinner';
import { G400, R400, Y200 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

import Flag, { FlagGroup } from '../src';
import { AppearanceArray, AppearanceTypes } from '../src/types';

const boldAppearanceNames = AppearanceArray.filter((val) => val !== 'normal');

type boldAppearanceItem = {
  name: string;
  value: AppearanceTypes;
  label: string;
};

const boldAppearanceItems: Array<boldAppearanceItem> = boldAppearanceNames.map(
  (val) => ({
    name: val,
    value: val,
    label: val,
  }),
);

const ConnectionDemo = () => {
  const [appearance, setAppearance] = useState<AppearanceTypes>(
    boldAppearanceNames[0],
  );

  const getTitle = (): string => {
    switch (appearance) {
      case 'error':
        return 'We are having issues';
      case 'info':
        return 'Connecting...';
      case 'success':
        return 'Connected';
      case 'warning':
        return 'Trying again...';
      default:
        return '';
    }
  };

  const getIcon = () => {
    switch (appearance) {
      case 'error':
        return <ErrorIcon label="Error" secondaryColor={R400} />;
      case 'info':
        // We wrap the Spinner in a div the same height as a standard Icon, to avoid
        // the flag height jumping when Flag.appearance is changed.
        return (
          <div
            css={css`
              height: ${gridSize() * 3}px;
              width: ${gridSize() * 3}px;
            `}
          >
            <Spinner size="small" appearance="invert" />
          </div>
        );
      case 'success':
        return <SuccessIcon label="Success" secondaryColor={G400} />;
      case 'warning':
        return <WarningIcon label="Warning" secondaryColor={Y200} />;
      default:
        return <SuccessIcon label="" secondaryColor={G400} />;
    }
  };

  const getDescription = () => {
    if (appearance === 'error') {
      return 'We cannot log in at the moment, please try again soon.';
    }
    return undefined;
  };

  const getActions = () => {
    if (appearance === 'warning') {
      return [{ content: 'Good luck!', onClick: () => {} }];
    }
    return undefined;
  };

  return (
    <div>
      <FlagGroup>
        <Flag
          appearance={appearance}
          icon={getIcon()}
          title={getTitle()}
          description={getDescription()}
          actions={getActions()}
          id="fake-flag"
        />
      </FlagGroup>
      <p>This story shows the transition between various flag appearances.</p>
      <RadioGroup
        options={boldAppearanceItems}
        onChange={(e: SyntheticEvent<HTMLInputElement>) => {
          setAppearance(e.currentTarget.value as AppearanceTypes);
        }}
        defaultValue={boldAppearanceNames[0]}
      />
    </div>
  );
};

export default ConnectionDemo;
