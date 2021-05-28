/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { IntlProvider } from 'react-intl';

import { Collaborator } from '../src/BlockCard/components/CollaboratorList';
import Page from '@atlaskit/page';
import { BlockCardResolvedView } from '../src/BlockCard';
import { smallImage } from '@atlaskit/media-test-helpers';

const subHeaderCSS = css`
  margin-top: 28px;
  margin-bottom: 8px;
`;

const resolvedIconProps = {
  url: 'broken-url',
};

const users: Collaborator[] = [
  {
    src: smallImage,
    name: 'Abhi',
  },
];

const bylineProps = {
  text: 'Updated 2 days ago. Created 3 days ago.',
  tooltip: 'Here is a byline',
};

const thumbnail = smallImage;

const providerProps = {
  name: 'Dropbox',
  icon: smallImage,
};

export default () => {
  return (
    <IntlProvider locale={'en'}>
      <Page>
        <div style={{ padding: '30px' }}>
          <h6 css={subHeaderCSS}>Block card with default icon</h6>
          <BlockCardResolvedView
            icon={resolvedIconProps}
            users={users}
            title="Smart Links - Designs"
            link="https://icatcare.org/app/uploads/2019/09/The-Kitten-Checklist-1.png"
            byline={bylineProps.text}
            thumbnail={thumbnail}
            context={{ text: providerProps.name, icon: providerProps.icon }}
          />
        </div>
      </Page>
    </IntlProvider>
  );
};
