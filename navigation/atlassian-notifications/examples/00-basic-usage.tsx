import React, { useEffect } from 'react';
import { Notifications } from '../src';

const onLoad = (...args: any[]) => {
  console.log('onLoad', ...args);
};

const BasicUsage = () => {
  // Fake the notifications iframe url as it is unreachable from examples
  useEffect(() => {
    const iframe = document.querySelector(
      'iframe[title="Notifications"]',
    ) as HTMLIFrameElement;
    if (iframe) {
      const content = `
        <h1>Notifications</h1>
        <script>
          setTimeout(() => {
            window.parent.postMessage('readyForUser', '*');
          }, 1000);
        </script>
      `;
      iframe.src = `data:text/html,${encodeURIComponent(content)}`;
    }
  }, []);

  return (
    <Notifications
      locale="en"
      onLoad={onLoad}
      product="jira"
      testId="jira-notifications"
      title="Notifications"
    />
  );
};

export default BasicUsage;
