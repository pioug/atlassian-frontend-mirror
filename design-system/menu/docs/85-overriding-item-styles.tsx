import React from 'react';

import { code, Example, md } from '@atlaskit/docs';

export default md`
  You can override the default styles for ButtonItem, LinkItem, and CustomItem using the \`cssFn\` prop.
You can target the sub-components of the Items using CSS selectors targetting using the data-attributes:
  - \`data-item-description\` for description
  - \`data-item-elem-before\` for elemBefore
  - \`data-item-elem-after\` for elemAfter


  ${code`highlight=10-27,36-47
import { LinkItem } from '@atlaskit/menu';

<MenuGroup>
  <Section title="Actions">
    <ButtonItem
      onClick={console.log}
      elemBefore={<ImgIcon src={koala} />}
      description="Hover over me"
      elemAfter={<RightArrow label="" />}
      cssFn={({ isSelected }) => {
        return {
          padding: '12px 20px',
          border: '1px solid #CDCDCD',
          backgroundColor: 'aliceblue',
          borderRadius: 3,
          '&:hover': {
            backgroundColor: 'antiquewhite',
          },
          ['&:hover [data-item-elem-after]']: { opacity: 1 },
          ['& [data-item-elem-after]']: { opacity: 0 },
          ['& [data-item-elem-before]']: { filter: 'grayscale(1)' },
          ['& [data-item-description]']: {
            fontStyle: 'italic',
            ...(isSelected && { textDecoration: 'underline' }),
          },
        };
      }}
    >
      Nested navigation item
    </ButtonItem>
    <ButtonItem
      onClick={console.log}
      iconBefore={<ImgIcon alt="" src={koala} />}
      description="Hover over me"
      iconAfter={<RightArrow label="" />}
      cssFn={() => ({
        color: 'red',
        '&:hover': {
          color: 'green',
          '[data-item-description]': {
            color: 'green',
          },
        },
        '& [data-item-description]': {
          color: 'red',
        },
      })}
    >
      Nested navigation item with cssFn override
    </ButtonItem>
  </Section>
</MenuGroup>
  `}

  ${(
    <Example
      title="Link item"
      Component={require('../examples/overriding-styles.tsx').default}
      source={require('!!raw-loader!../examples/overriding-styles.tsx')}
    />
  )}

`;
