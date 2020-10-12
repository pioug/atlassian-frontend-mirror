import React from 'react';
import {
  md,
  code,
  Example,
  Props,
  AtlassianInternalWarning,
} from '@atlaskit/docs';

export default md`
  ${(
    <>
      <div style={{ marginBottom: '0.5rem' }}>
        <AtlassianInternalWarning />
      </div>
    </>
  )}

  ## Usage

  ${code`
  import React from 'react';

  import HelpArticle from '../src';

  export default class extends React.Component {
    render() {
      return (
        <HelpArticle
          title="Article Title"
          body="Quisque eros orci, sagittis vitae augue eget, ultrices varius dolor. Nunc mi leo, accumsan id massa nec, commodo placerat libero. Phasellus ullamcorper ligula facilisis massa tempor auctor. Praesent malesuada, eros sit amet posuere rutrum, justo ex tempor dui, at suscipit metus lacus non dui. Phasellus vehicula urna eu rhoncus sagittis. Integer at risus molestie, rutrum nibh nec, vehicula lacus. Nulla mollis dictum felis vitae facilisis. Nam faucibus non orci eget gravida."
        />
      );
    }
  }

  `}

  ${(
    <Example
      Component={require('../examples/1-Help-article').default}
      title="Help Article"
      source={require('!!raw-loader!../examples/1-Help-article')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/HelpArticle')}
    />
  )}
`;
