import React, { useState, useCallback } from 'react';
import ExpandIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import CollapseIcon from '@atlaskit/icon/glyph/hipchat/chevron-up';
import CopyIcon from '@atlaskit/icon/glyph/copy';

import { N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Button from '@atlaskit/button/standard-button';

import { ProviderCard } from './ProviderCard';
import { type ExampleUrl, type ExampleUIConfig } from './types';

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
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
    <div key={category} style={{ marginBottom: token('space.600', '48px') }}>
      <div
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
        className="header"
        style={{
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          display: 'flex',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          justifyContent: 'space-between',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          width: '85%',
        }}
      >
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
        <div className="left">
          <h4
            style={{
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
              textTransform: 'uppercase',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
              letterSpacing: '0.2rem',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
              fontWeight: 'bolder',
            }}
          >
            {categoryTitle}
          </h4>
          <h5
            style={{
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
              color: token('color.text.subtlest', N200),
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
              paddingBottom: token('space.300', '24px'),
            }}
          >
            {categoryExamplesTotal} entities supported across {examples.length}{' '}
            providers.
          </h5>
        </div>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
        <div className="right">
          <Button
            iconBefore={<CopyIcon size="small" label="" />}
            onClick={handleCopyToClipboard}
            style={{
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
              marginRight: token('space.100', '8px'),
            }}
          >
            Copy
          </Button>
          {Object.entries(expanded).every(([, isExpanded]) => isExpanded) ? (
            <Button
              iconBefore={<CollapseIcon size="small" label="" />}
              onClick={handleCollapseAll}
            >
              Collapse all
            </Button>
          ) : (
            <Button
              iconBefore={<ExpandIcon size="small" label="" />}
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
