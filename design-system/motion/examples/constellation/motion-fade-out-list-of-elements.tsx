/** @jsx jsx */
import { useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import {
  BitbucketIcon,
  ConfluenceIcon,
  JiraServiceManagementIcon,
  JiraSoftwareIcon,
  OpsgenieIcon,
  StatuspageIcon,
} from '@atlaskit/logo';
import {
  ExitingPersistence,
  FadeIn,
  StaggeredEntrance,
} from '@atlaskit/motion';
import { token } from '@atlaskit/tokens';

import { Block } from '../../examples-utils';

const MotionFadeOutListOfElementsExample = () => {
  const [items, setItems] = useState(logos);

  return (
    <div css={retryContainerStyles}>
      <Button onClick={() => setItems((list) => randRemove(list))}>
        Random remove
      </Button>
      <Button onClick={() => setItems(logos)}>Reset</Button>

      <ul css={listStyles}>
        <StaggeredEntrance>
          <ExitingPersistence appear>
            {items.map((logo) => (
              // Gotcha #1 set propery keys YO
              <FadeIn key={logo[1] as string}>
                {(props) => (
                  <li {...props} css={listItemStyles}>
                    <Block css={blockStyles}>
                      <div css={logoContainerStyles}>
                        {logo[0]}
                        <h3 css={headerStyles}>{logo[1]}</h3>
                      </div>
                    </Block>
                  </li>
                )}
              </FadeIn>
            ))}
          </ExitingPersistence>
        </StaggeredEntrance>
      </ul>
    </div>
  );
};

const logos = [
  [<BitbucketIcon size="small" />, 'Bitbucket'],
  [<ConfluenceIcon size="small" />, 'Confluence'],
  [<JiraServiceManagementIcon size="small" />, 'Jira Service Management'],
  [<JiraSoftwareIcon size="small" />, 'Jira Software'],
  [<OpsgenieIcon size="small" />, 'Opsgenie'],
  [<StatuspageIcon size="small" />, 'Statuspage'],
];

const randRemove = <T extends Array<TItem>, TItem>(arr: T) => {
  const newArr = arr.concat([]);
  newArr.splice(Date.now() % newArr.length, 1);
  return newArr;
};

const retryContainerStyles = css({
  textAlign: 'center',
  '> *': {
    marginRight: token('space.050', '4px'),
  },
});

const listStyles = css({
  maxWidth: '474px',
  height: '328px',
  margin: `${token('space.200', '16px')} !important`,
  padding: token('space.0', '0px'),
  div: {
    margin: token('space.0', '0px'),
  },
});

const listItemStyles = css({
  display: 'block',
  margin: token('space.100', '8px'),
  padding: token('space.0', '0px'),
});

const blockStyles = css({
  width: '100%',
  height: '48px',
  borderRadius: token('border.radius.100', '3px'),
});

const logoContainerStyles = css({
  display: 'flex',
  width: '100%',
  paddingLeft: token('space.100', '8px'),
  alignItems: 'center',
});

const headerStyles = css({
  margin: token('space.0', '0px'),
  marginLeft: token('space.100', '8px'),
  fontWeight: 300,
});

export default MotionFadeOutListOfElementsExample;
