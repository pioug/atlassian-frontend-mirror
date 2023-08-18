import React, { useMemo } from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import { Link } from '@atlaskit/linking-types';
import { Card } from '@atlaskit/smart-card';
import LinkUrl from '@atlaskit/smart-card/link-url';
import { N300 } from '@atlaskit/theme/colors';
import { h300 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

interface LinkProps extends Link {
  testId?: string;
}

const linkStyles = {
  key: {
    ...h300(),
    color: token('color.text.subtlest', N300),
    fontWeight: 600,
  },
  default: {},
};

export const LINK_TYPE_TEST_ID = 'link-datasource-render-type--link';

const LinkRenderType = ({
  style,
  url,
  text,
  testId = LINK_TYPE_TEST_ID,
}: LinkProps) => {
  const linkStyle: React.CSSProperties = useMemo(() => {
    return (style?.appearance && linkStyles[style.appearance]) || {};
  }, [style]);

  const anchor = useMemo(
    () => (
      <LinkUrl
        href={url}
        style={linkStyle}
        data-testid={testId}
        target="_blank"
      >
        {text || url}
      </LinkUrl>
    ),
    [linkStyle, url, text, testId],
  );

  const SmartCard = () => (
    <ErrorBoundary fallback={anchor}>
      <Card appearance="inline" url={url} testId={testId} />
    </ErrorBoundary>
  );

  return text ? anchor : <SmartCard />;
};

export default React.memo(LinkRenderType);
