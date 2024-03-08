import React from 'react';
import SectionMessage from '@atlaskit/section-message';

export function createSingletonNotice(componentName: string) {
  const title = `${componentName} is a singleton package`;
  return (
    <SectionMessage title={title} appearance="error">
      <p>
        Having multiple versions of {componentName} installed can result in
        potential issues, such as media preview failures.
      </p>
      <p>
        You must ensure that your application dependencies only resolve to a
        unique package version, if you are:
        <ul>
          <li>
            <b>A platform consumer</b> — i.e. you are using {componentName}{' '}
            directly in a npm package, for instance in a monorepository. Define{' '}
            {componentName} in your package.json file as a{' '}
            <code>peerDependency</code> and <code>devDependency</code> (for
            local testing).
          </li>
          <li>
            <b>A product consumer</b> — i.e. you are working directly into your
            application. Define {componentName} in your package.json file as a
            direct dependency.
          </li>
        </ul>
      </p>
      <p>
        If you have any questions or need assistance in consuming this package
        correctly, please reach out to the{' '}
        <a
          href="https://atlassian.slack.com/archives/C020CGJDJ3A"
          target="_blank"
        >
          #help-media-platform
        </a>{' '}
        channel.
      </p>
    </SectionMessage>
  );
}
