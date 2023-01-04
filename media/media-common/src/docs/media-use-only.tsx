import React from 'react';
import SectionMessage from '@atlaskit/section-message';

function AlternativePackagesMessage({
  alternatePackages,
}: React.PropsWithoutRef<{
  alternatePackages?: { name: string; link: string }[];
}>) {
  if (!alternatePackages) {
    return null;
  }
  if (alternatePackages.length === 1) {
    return (
      <p>
        Consider using{' '}
        <a href={alternatePackages[0].link}>{alternatePackages[0].name}</a>{' '}
        instead.
      </p>
    );
  }
  return (
    <p>
      Consider using one of these packages instead:
      <ul>
        {alternatePackages.map((p) => (
          <li>
            <a href={p.link}>{p.name}</a>
          </li>
        ))}
      </ul>
    </p>
  );
}

export function createMediaUseOnlyNotice(
  componentName: string,
  alternatePackages?: { name: string; link: string }[],
) {
  return (
    <SectionMessage title="Internal Media Use Only" appearance="error">
      <p>
        {componentName} is intended for internal use by the Media Platform and
        as a transitive dependency of a media package within your product.
      </p>
      <p>Direct use of this component is not supported.</p>
      <AlternativePackagesMessage alternatePackages={alternatePackages} />
    </SectionMessage>
  );
}
