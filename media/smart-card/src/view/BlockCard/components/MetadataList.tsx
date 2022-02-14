/** @jsx jsx */
import { jsx } from '@emotion/core';

import { MetadataProps, Metadata } from './Metadata';
import { gs } from '../utils';

export interface MetadataListProps {
  items: MetadataProps[];
  testId?: string;
}

export const metadataListClassName = 'smart-link-metadata-list';

export const MetadataList = ({ items, testId }: MetadataListProps) => {
  return (
    <div
      css={{
        display: 'flex',
        marginTop: gs(0.5),
        alignItems: 'center',
        '&:last-child': {
          marginRight: '0px',
        },
      }}
      data-testid={testId}
      className={metadataListClassName}
    >
      {items.map((item) => (
        <Metadata key={item.text} {...item} />
      ))}
    </div>
  );
};
