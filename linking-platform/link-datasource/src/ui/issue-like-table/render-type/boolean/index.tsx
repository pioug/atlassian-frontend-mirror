import React, { useMemo } from 'react';

import { useIntl } from 'react-intl-next';

import { BooleanType } from '@atlaskit/linking-types';

import TextRenderType from '../text';

import { booleanTypeMessages } from './messages';

interface BooleanProps {
  testId?: string;
  value: BooleanType['value'];
}

export const BOOLEAN_TYPE_TEST_ID = 'link-datasource-render-type--boolean';

const BooleanRenderType = ({
  value,
  testId = BOOLEAN_TYPE_TEST_ID,
}: BooleanProps) => {
  const intl = useIntl();
  const booleanValue = value?.value;

  const TRUTHY_TEXT = intl.formatMessage(
    booleanTypeMessages.booleanTruthyValue,
  );
  const FALSY_TEXT = intl.formatMessage(booleanTypeMessages.booleanFalsyValue);

  const displayTextObject = useMemo(
    () => ({ value: booleanValue ? TRUTHY_TEXT : FALSY_TEXT }),
    [booleanValue, TRUTHY_TEXT, FALSY_TEXT],
  );

  if (typeof booleanValue !== 'boolean') {
    return <></>;
  }

  return <TextRenderType text={displayTextObject} testId={testId} />;
};

export default BooleanRenderType;
