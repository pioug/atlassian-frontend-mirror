import prepareSwitcher from '../../src';

/**
 * This file is an example of how to use the Atlassian Switcher with just vanilla JS. Should be easy enough
 * to adapt the code here to any other stacks like angular, ember, jquery, etc
 */
export const initSwitcher = () => {
  // bootstrap the switcher
  const switcher = prepareSwitcher(
    {
      product: 'trello',
      disableCustomLinks: true,
      cloudId: 'some-cloud-id',
      appearance: 'standalone',
    },
    (event: any, channel: any) => {
      console.log(
        `Provided Listener: AnalyticsEvent(${channel})\n\tpayload=%o\n\tcontext=%o`,
        event.payload,
        event.context,
      );
    },
  );

  // get a reference to the element where the switcher will be rendered
  const container = document.getElementById('switcher-container');

  let hasRendered = false;
  let renderedSwitcher: any = null;

  const triggerBtn = document.getElementById('switcher-trigger');
  const destroyBtn = document.getElementById('switcher-destroy');

  if (!container) {
    throw new Error('Missing container');
  }

  if (!triggerBtn) {
    throw new Error('Missing trigger button');
  }

  if (!destroyBtn) {
    throw new Error('Missing destroy button');
  }

  triggerBtn.onmouseenter = function () {
    // prefetch bundles and api calls
    switcher.prefetch();
  };

  triggerBtn.onclick = function () {
    if (hasRendered) {
      return;
    }

    // save the returned value so you can destroy it later.
    renderedSwitcher = switcher.renderAt(container);
    hasRendered = true;

    // show the fake inline dialog
    container.style.display = 'inline-block';
  };

  destroyBtn.onclick = function () {
    if (!renderedSwitcher) {
      return;
    }

    // destroy the switcher using the previously saved handler
    renderedSwitcher.destroy();
    renderedSwitcher = null;
    hasRendered = false;

    // hide the fake inline dialog
    container.style.display = 'none';
  };
};
