import { md, code } from '@atlaskit/docs';

export default md`
  Use this wrapper if you need to consume the Atlassian Switcher on a non react app.

  ## Usage

  #### Bootstrap

  Initialize the Atlassian Switcher with the settings for your product and an analytics handler.

  The analytics handler should handle communication with your servers to send the events.

  ${code`
import prepareSwitcher from '@atlaskit/atlassian-switcher-vanilla';

const switcher = prepareSwitcher({
  product: 'opsgenie',
  disableCustomLinks: true,
  disableRecentContainers: true,
  disableHeadings: true,
  cloudId: 'some-cloud-id',
  appearance: 'standalone',
},
(event, channel) => {
  console.log(
      channel,
      event.payload,
      event.context,
  )

  // send the events to your server here
});
`}

  *Documentation for the settings available can be found at the main [Atlassian Switcher package](/packages/navigation/atlassian-switcher).*

  #### Rendering

  When you are ready, render the switcher on the appropriate container. Save the result of this
  method so you can destroy the switcher later.

  ${code`
  const renderedSwitcher = switcher.renderAt(container);
  `}

  #### Clean up

  To safely remove the switcher, removing the DOM nodes and event handlers associated to it, call
  the destroy method included in the result of the \`renderAt\` call.

  ${code`
  renderedSwitcher.destroy();
  `}

  #### Performance

  The switcher requires lots of static assets and api calls to be loaded before it can be shown. In order to avoid delays, we
  expose a \`prefetch\` method that you can call when the intent to open the switcher is clear (i.e: when the trigger is
  hovered just before the click).

  ${code`
    triggerBtn.onmouseenter = () => switcher.prefetch();
  `}

  *Prefetch will call our APIs so please do not abuse it*

  ## API details

  #### \`prepareSwitcher(switcherProps, analyticsListener)\`
  Main method, used to prepare the switcher before usage. It takes 2 arguments:
  - \`switcherProps\` takes the props that will be passed down to the switcher;
  - \`analyticsListener\` takes a function that will handle analytics;

  The return value of this method will include 2 other methods:
  - \`prefetch()\` - to prefetch bundles and api calls so when you open the switcher, everything is there already.
  We recommend to call this method when the user hovers the trigger to open the switcher. This method only runs once, subsequent calls will do nothing.

  - \`renderAt(container)\` - render the switcher on the container specified. The container should be already in the page.
  This method will return a function that should be called when you want to destroy the switcher;

  ## Switcher props

  For the complete documentation on Atlassian Switcher, head to [Atlassian Switcher](/packages/navigation/atlassian-switcher)
`;
