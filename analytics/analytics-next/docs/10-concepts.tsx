import { code, md } from '@atlaskit/docs';

export default md`
There are 3 abstract layers as part of \`@atlaskit/analytics-next\`:

- [Analytics Listeners](./listeners) (responsible for sending events over the network)
- [Consumer Components](./usage-with-presentational-components) (target components that are desired to be tracked. They fire events that the listener consumes)
- [Analytics Contexts](./usage-for-container-components) (provides contextual data to consumer components about the \"container\" they are embeded in. This data is added to the event fired by all consumer components that are its children.)

### React Context: !important;

These layers communicate via React context. Historically this package has used [legacy React Context][legacy-context], but
is now transitioning to use only the new [React Context API][modern-context]. This is to prepare for
future versions of React in which legacy Context will be dropped, but also partially for performance reasons.

To achieve dropping legacy context we are rolling the drop out in 2 phases:

#### Phase I (version 7.1.0)

Analytics consuming components receive only modern context. Listeners and the Context layer will provide both modern and legacy context by default.

At their own risk, package consumers can opt in to no longer supply legacy context by using the environment variable
ANALYTICS_NEXT_MODERN_CONTEXT=true.

When doing so, any analytics consumers that rely on legacy context will not receive any, and events may be lost! This would happen when using old atlaskit packages that consume a version of @atlaskit/analytics-next before version 7.1.0.

#### Phase II (future major)

In a future release (TBA) we will remove all legacy context support and clean up the branching around ANALYTICS_NEXT_MODERN_CONTEXT.
After this point, @atlaskit/analytics-next will not work with components that use a version prior to 7.1.0.

### Example

${code`
  // ---- CONSUMER COMPONENT LAYER ----

  // We want to add tracking for the 'click' of this button
  const TargetButton = ({ onClick }) => {
    // this analytics event is given to the callback via the
    // HOC wrapping of this component below
    const handler = (clickEvent, analyticsEvent) => {
      analyticsEvent.fire("myTargetChannel");
    };

    return <button onClick={handler}>Track me</button>
  }

  // Analytics can be baked into your target components
  // in a number of ways, this is just one of many!
  const AnalyticsWrappedButton = withAnalyticsEvent({
    onClick: {
      component: 'button',
      action: 'clicked'
    }
  })(TargetButton);

  // ---- ANALYTICS CONTEXT LAYER ----

  // Our target button is going to be used inside of a form
  const FormContainer = ({ children }) => {
    return (
      <form>
        {children}
      </form>
    );
  }

  // This wrapper gives the container a way of passing to its children
  // components some context about where it is consumed.
  // Again there are a few ways of doing this!
  const AnalyticsWrappedForm = withAnayticsContext({
    container: 'submissionForm',
    page: '/invite-a-friend'
  })(FormContainer);

  // ---- ANALYTICS LISTENER LAYER ----

  // This is our App's listener
  // Note: It is possible to have multiple listeners, all listening
  // on different channels, allowing for different handlers for different
  // kind of events
  const OurAnalyticsListener = ({ children }) => {
    const onEvent = (event, channel) => {
      // these components are agnostic to what you want to use
      // to send events to the network
      someClient.sendToNetwork(event);

      expect(event.payload).toBe({
        action: 'clicked'
        component: 'button'
      });

      // an array of contexts (multiple context containers can be nested)
      expect(event.context).toBe([{
        container: 'submissionForm',
        page: '/invite-a-friend'
      });
    };

    return (
      <AnalyticsListener channel="myTargetChannel" onEvent={onEvent}>
        {children}
      </AnalyticsListener>
    )
  }

  // ---- ALL TOGETHER ----

  export const ExampleApp = () => {
    return (
      <OurAnalyticsListener>           // Listener layer in this example
        <AnalyticsWrappedForm>         // Context layer in this example
          <AnalyticsWrappedButton/>    // Consumer component layer in this example
        </AnalyticsWrappedForm>
      </OurAnalyticsListener>);
  };
`}

[legacy-context]: https://reactjs.org/docs/legacy-context.html
[modern-context]: https://reactjs.org/docs/context.html
`;
