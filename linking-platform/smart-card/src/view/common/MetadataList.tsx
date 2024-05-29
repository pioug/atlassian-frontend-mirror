/** @jsx jsx */
import { jsx } from '@emotion/react';
import { type MetadataProps, Metadata } from './Metadata';
import { gs } from './utils';

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
        // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
        marginTop: gs(0.5),
        alignItems: 'center',
        '&:last-child': {
          marginRight: '0px',
        },
      }}
      data-testid={testId}
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
      className={metadataListClassName}
    >
      {items.map((item) => (
        <Metadata key={item.text} {...item} />
      ))}
    </div>
  );
};
