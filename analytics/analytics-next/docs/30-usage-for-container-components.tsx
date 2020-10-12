import { code, md } from '@atlaskit/docs';

export default md`
This guide describes how to set up analytics for a React component that is a
container for children that fire analytics events, and where you wish to include
contextual information to those children about where it is embeded in the event fired.

For example, you might fire an event on a button click, but want to distinguish
whether it was from inside a form or on the navigation panel.

Analytics Contexts are the way this is achieved in \`@atlaskit/analytics-next\`.

For a conceptual overview of \`@atlaskit/analytics-next\`, please consult the
[concepts page](./concepts).

Container components can pass this context in two key ways:

#### 1) Using the \`withAnalyticsContext\` higher order component (Recommended)

${code`
  import { withAnalyticsContext } from '@atlaskit/analytics-next';

  const MyContainer = ({children}) => {
    return (
      <div>
        {children}
      </div>
    );
  }

  const AnalyticsWrappedContainer = withAnalyticsContext({
    issueId: 'ABC-123',
    issueType: 'bug'
  })(MyContainer);

  export AnalyticsWrappedContainer;
`}

#### 2) Use the \`AnalyticsContext\` component manually

${code`
  import { AnalyticsContext } from '@atlaskit/analytics-next';

  export MyContainer = ({children}) => {
    const data = {
      issueId: 'ABC-123',
      issueType: 'bug'
    };

    return (
      <div>
        <AnalyticsContext data={data}>
          {children}
        </AnalyticsContext>
      </div>
    );
`}

#### Side note
While it is possible to use the React context from \`@atlaskit/analytics-next-stable-react-context\` directly,
we encourage you to use one of these two approaches instead, as they are optimised to ensure the value provided
to React Context is a stable reference, and won't introduce unnecessary re-renders.
`;
