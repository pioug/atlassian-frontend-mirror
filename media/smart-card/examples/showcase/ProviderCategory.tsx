import React, { useState, useCallback } from 'react';
import ExpandIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import CollapseIcon from '@atlaskit/icon/glyph/hipchat/chevron-up';
import CopyIcon from '@atlaskit/icon/glyph/copy';

import { N200 } from '@atlaskit/theme/colors';
import Button from '@atlaskit/button';

import { ProviderCard } from './ProviderCard';
import { ExampleUrl, ExampleUIConfig } from './types';

interface ProviderCategoryProps {
  category: string;
  examples: ExampleUrl[];
  config: ExampleUIConfig;
}

export const ProviderCategory = ({
  category,
  examples,
  config,
}: ProviderCategoryProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    getExpanded(examples),
  );

  const handleExpand = useCallback(
    (resolver: string) => {
      setExpanded({ ...expanded, [resolver]: true });
    },
    [expanded, setExpanded],
  );
  const handleCollapse = useCallback(
    (resolver: string) => {
      setExpanded({ ...expanded, [resolver]: false });
    },
    [expanded, setExpanded],
  );
  const handleExpandAll = useCallback(() => {
    setExpanded(setAllKeys(expanded, true));
  }, [expanded, setExpanded]);
  const handleCollapseAll = useCallback(() => {
    setExpanded(setAllKeys(expanded, false));
  }, [expanded, setExpanded]);
  const handleCopyToClipboard = useCallback(() => {
    const exampleClipboard = examples.reduce<string[]>(
      (acc, example) =>
        acc.concat(
          example.examples.reduce<string[]>(
            (accInner, resolverExample) =>
              accInner.concat(resolverExample.urls),
            [],
          ),
        ),
      [],
    );
    const exampleClipboardAll = exampleClipboard.reduce<string[]>(
      (acc, exampleBatch) => acc.concat(exampleBatch),
      [],
    );
    navigator.clipboard.writeText(exampleClipboardAll.join('\n'));
  }, [examples]);

  const categoryTitle = category.replace(/-/g, ' ');
  const categoryExamplesTotal = examples.reduce((sum, example) => {
    sum += example.examples.length;
    return sum;
  }, 0);
  return (
    <div key={category} style={{ marginBottom: '48px' }}>
      <div
        className="header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '85%',
        }}
      >
        <div className="left">
          <h4
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.2rem',
              fontWeight: 'bolder',
            }}
          >
            {categoryTitle}
          </h4>
          <h5 style={{ color: N200, paddingBottom: '24px' }}>
            {categoryExamplesTotal} entities supported across {examples.length}{' '}
            providers.
          </h5>
        </div>
        <div className="right">
          <Button
            iconBefore={<CopyIcon size="small" label="copy" />}
            onClick={handleCopyToClipboard}
            style={{
              marginRight: '8px',
            }}
          >
            Copy
          </Button>
          {Object.entries(expanded).every(([, isExpanded]) => isExpanded) ? (
            <Button
              iconBefore={<CollapseIcon size="small" label="collapse" />}
              onClick={handleCollapseAll}
            >
              Collapse all
            </Button>
          ) : (
            <Button
              iconBefore={<ExpandIcon size="small" label="expand" />}
              onClick={handleExpandAll}
            >
              Expand all
            </Button>
          )}
        </div>
      </div>
      {examples
        .sort((exampleA, exampleB) =>
          exampleA.resolver.localeCompare(exampleB.resolver),
        )
        .map((example) => (
          <ProviderCard
            key={example.resolver}
            {...example}
            expanded={expanded[example.resolver]}
            onExpand={handleExpand}
            onCollapse={handleCollapse}
            config={config}
          />
        ))}
    </div>
  );
};

const getExpanded = (examples: ExampleUrl[]) => {
  const expanded: Record<string, boolean> = {};
  for (const example of examples) {
    expanded[example.resolver] = false;
  }
  return expanded;
};

const setAllKeys = (expandedMap: Record<string, boolean>, value: boolean) => {
  const allMappings: Record<string, boolean> = {};
  for (const resolver of Object.keys(expandedMap)) {
    allMappings[resolver] = value;
  }
  return allMappings;
};
