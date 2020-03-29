import React from 'react';
import { code, md, Example, Props } from '@atlaskit/docs';

export default md`
  If you need more control you can compose your own badge using \`Container\` and \`Format\` components.

  ${(
    <Example
      highlight="2,6,8,10"
      packageName="@atlaskit/badge"
      Component={require('../examples/4-composing').default}
      title="Composing your own badge"
      source={require('!!raw-loader!../examples/4-composing')}
    />
  )}

  ## Container

  This component retains the styling of a normal badge,
  but without formatting.
  This means you can compose in whatever information you need to.

${code`
import { Container } from '@atlaskit/badge';

// Displays: <em>100+</em>
<Container><em>100+</em></Container>
`}

  _Beware that putting arbitrary content inside of a badge might cause it to take on an unintended look._

  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/components/ContainerProps')}
    />
  )}

  ## Format

  This component can be used to compose your own badge together,
  or if you need the badge style formatting somewhere else.

  ${code`
import { Container, Format } from '@atlaskit/badge';

// Displays: <em>999+</em>
<Container><em><Format>{1000}</Format></em></Container>
`}


  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/components/Format')}
    />
  )}
`;
