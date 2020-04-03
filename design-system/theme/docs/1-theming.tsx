import React, { ReactNode } from 'react';
import Lozenge from '@atlaskit/lozenge';
import { md, Example, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

const Experimental = ({ children }: { children: ReactNode }) => (
  <h2>
    {children} <Lozenge appearance="moved">experimental</Lozenge>
  </h2>
);

export default md`
${(
  <SectionMessage appearance="warning" title="Experimental">
    Theming isn't currently stable, if you use it you do so at your own risk.
    Really need to get it prioritized? Please raise a ticket on our{' '}
    <a
      target="_blank"
      href="https://ecosystem.atlassian.net/servicedesk/customer/portal/24"
    >
      Service Desk
    </a>
    .
  </SectionMessage>
)}

${(<Experimental>Creating themes</Experimental>)}

The \`createTheme\` function is at the heart of the theming API and is used in the global theme and reset theme. Much like React's \`createContext\`, the \`createTheme\` function returns you a \`Consumer\` and \`Provider\` that you use to get and set a theme, respectively.

${(
  <Example
    packageName="@atlaskit/theme"
    Component={require('../examples/creating-themes').default}
    source={require('!!raw-loader!../examples/creating-themes')}
    title="Creating themes"
  />
)}

${(<Experimental>Theming components</Experimental>)}

Whenever you create a new theme, it provides you a context specific to that theme. When theming a component, you use this context to provide a theme for your component. It is recommended that you, at the very least, export the provider for your theme so consumers can customise the look and feel of your component.

${(
  <Example
    packageName="@atlaskit/theme"
    Component={require('../examples/theming-components').default}
    source={require('!!raw-loader!../examples/theming-components')}
    title="Creating themes"
  />
)}

${(<Experimental>The global theme</Experimental>)}

The global theme is the \`default\` export of the theme package. It is defined by using the \`createTheme\` function, so it will give you both a \`Consumer\` and \`Provider\` for you to use or customise as you see fit.

${(
  <Example
    packageName="@atlaskit/theme"
    Component={require('../examples/global-theme').default}
    source={require('!!raw-loader!../examples/global-theme')}
    title="Creating themes"
  />
)}

${(<Experimental>Reset</Experimental>)}

The \`Reset\` component applies CSS reset styles to select descendant nodes according to the ADG.

${(
  <Example
    packageName="@atlaskit/theme"
    Component={require('../examples/reset').default}
    source={require('!!raw-loader!../examples/reset')}
    title="Reset"
  />
)}

As shown above, the \`Reset\` comes with defaults based on the ADG, but it also allows you to customise it via a theme.

${(
  <Example
    packageName="@atlaskit/theme"
    Component={require('../examples/themed-reset').default}
    source={require('!!raw-loader!../examples/themed-reset')}
    title="Themed reset"
  />
)}

${(
  <Props
    props={require('!!extract-react-types-loader!../src/components/Reset')}
  />
)}

___Unlike in the deprecated \`AtlaskitThemeProvider\`, this is not applied automatically - or globally - so it is up to you to put this in your app where appropriate.___
`;
