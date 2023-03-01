/** @jsx jsx */
import { FC, Fragment } from 'react';

import { jsx } from '@emotion/react';

import { gridSize } from '@atlaskit/theme/constants';

import { getBoxShadow, getBoxShadowAsList } from '../../utils';
import type { TransformedTokenMerged } from '../types';

import TokenButton from './token-button';
import {
  Color,
  Elevation,
  Label,
  Opacity,
  Space,
} from './token-button-variants';

interface CopyButtonValueProps
  extends Pick<TransformedTokenMerged, 'value' | 'original' | 'attributes'> {
  variantLabel?: string;
  isFixedWidth?: boolean;
  className?: string;
  testId?: string;
}

const TokenButtonValue = ({
  value,
  original,
  attributes,
  variantLabel,
  isFixedWidth,
  className,
  testId,
}: CopyButtonValueProps) => {
  const group = attributes.group;

  const labelValue = () => {
    switch (group) {
      case 'shadow':
        return <BoxShadowValue boxShadowValue={value} />;
      case 'spacing':
        return value;
      default:
        return original.value.length > 12
          ? // Break the long base token names and wrap to two lines e.g.
            // DarkNeutral
            // 1000
            original.value
              .match(/[a-z]+|[^a-z]+./gi)
              .map((breakWord: string) => (
                <Fragment>
                  {breakWord}
                  {'\n'}
                </Fragment>
              ))
          : original.value;
    }
  };

  const copyValue = () => {
    switch (group) {
      case 'shadow':
        return getBoxShadow(value);
      case 'spacing':
        return value;
      default:
        return original.value;
    }
  };

  return (
    <TokenButton
      copyValue={copyValue()}
      variantLabel={variantLabel}
      isFixedWidth={isFixedWidth}
      className={className}
      testId={testId}
    >
      {({ isHovered }) => (
        <Fragment>
          {group === 'opacity' && <Opacity value={value} />}
          {group === 'shadow' && <Elevation value={value} />}
          {(group === 'paint' || group === 'raw') && <Color value={value} />}
          {group === 'spacing' && <Space value={value} />}
          <Label isHovered={isHovered}>{labelValue()}</Label>
        </Fragment>
      )}
    </TokenButton>
  );
};

const BoxShadowValue: FC<{ boxShadowValue: any }> = (props) => {
  const { boxShadowValue } = props;
  const boxShadowsAsList = getBoxShadowAsList(boxShadowValue);

  return (
    <span css={{ display: 'flex', flexDirection: 'column' }}>
      {boxShadowsAsList.map((value) => (
        <span
          key={value}
          css={{ display: 'block', '& + &': { marginTop: gridSize() } }}
        >
          {value}
        </span>
      ))}
    </span>
  );
};

export default TokenButtonValue;
