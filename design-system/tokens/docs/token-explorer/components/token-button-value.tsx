/** @jsx jsx */
import { FC, Fragment } from 'react';

import { jsx } from '@emotion/react';

import { gridSize } from '@atlaskit/theme/constants';

import { getBoxShadow, getBoxShadowAsList } from '../../utils';
import type { TransformedTokenMerged } from '../types';

import TokenButton from './token-button';
import { Color, Elevation, Label, Opacity } from './token-button-variants';

interface CopyButtonValueProps
  extends Pick<TransformedTokenMerged, 'value' | 'original' | 'attributes'> {
  className?: string;
}

const TokenButtonValue = ({
  value,
  original,
  attributes,
  className,
}: CopyButtonValueProps) => {
  return (
    <TokenButton
      copyValue={
        attributes.group === 'shadow' ? getBoxShadow(value) : original.value
      }
      shouldFitContainer
      className={className}
    >
      {({ isHovered }) => (
        <Fragment>
          {attributes.group === 'opacity' && <Opacity value={value} />}
          {attributes.group === 'shadow' && <Elevation value={value} />}
          {(attributes?.group === 'paint' || attributes?.group === 'raw') && (
            <Color value={value} />
          )}
          <Label isHovered={isHovered}>
            {attributes.group === 'shadow' ? (
              <BoxShadowCopy boxShadowValue={value} />
            ) : (
              original.value
            )}
          </Label>
        </Fragment>
      )}
    </TokenButton>
  );
};

const BoxShadowCopy: FC<{ boxShadowValue: any }> = (props) => {
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
