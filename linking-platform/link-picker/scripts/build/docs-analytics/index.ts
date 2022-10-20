import { readFileSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';

import { prompt } from 'enquirer';

import {
  table,
  tableRow,
  td,
  th,
  p,
  code,
  doc,
  b,
  status,
  panel,
  date,
} from '@atlaskit/adf-utils/builders';
import { PanelType, TableCellDefinition } from '@atlaskit/adf-schema';

import { preProcessSpec } from '../codegen-analytics/context';
import {
  AttributeSpec,
  EventSpec,
  NormalizedSpec,
} from '../codegen-analytics/types';
import { getEventKey } from '../codegen-analytics/generate-source';

import {
  formatAttributeType,
  EVENT_TYPE_COLORS,
  formatBooleanAsEmoji,
} from './formatters';
import { getCurrentPageVersion, updatePage } from './publish';

const INPUT_FILE = 'analytics.spec.yaml';

/**
 * Event types we want to report on
 * (ie don't report on operational events)
 */
const EVENT_TYPE_ALLOWLIST = ['ui', 'track'];

type EventAttributeMatrix = Record<
  string,
  { spec: AttributeSpec; events: Record<string, boolean> }
>;

const eventAttributeMatrix = (events: NormalizedSpec['events']) => {
  return events.reduce<EventAttributeMatrix>((acc, event) => {
    return {
      ...acc,
      ...Object.entries(event.attributes).reduce((attrs, [name, attribute]) => {
        return {
          ...attrs,
          [name]: {
            spec: attribute,
            events: {
              ...(acc[name]?.events ?? {}),
              [getEventKey(event)]: true,
            },
          },
        };
      }, {}),
    };
  }, {});
};

const fullWithTable: typeof table = (...content) => {
  return {
    ...table(...content),
    attrs: {
      isNumberColumnEnabled: true,
      layout: 'full-width',
    },
  };
};

type CellContent =
  | TableCellDefinition['content']
  | TableCellDefinition['content'][0];

type AttributeName = string;

interface EventAttributeCellRender {
  (attr: [AttributeName, AttributeSpec], event?: EventSpec): CellContent;
}

type EventName = string;

type Attrs = any;

type TableDefinition = [
  EventName | [EventName, Attrs] | [CellContent, Attrs],
  EventAttributeCellRender,
][];

const fixedColumns: TableDefinition = [
  [['Attribute Name', { colwidth: [220] }], ([attrName]) => code(attrName)],
  [
    ['Type / Values', { colwidth: [220] }],
    ([, attrSpec]) => formatAttributeType(attrSpec),
  ],
  [
    ['Description', { colwidth: [400] }],
    ([, { description }]) => p(description),
  ],
];

const asArray = <T extends unknown>(content: T | T[]) => {
  return Array.isArray(content) ? content : [content];
};

const renderHeaderCellContent = (
  def: EventName | [EventName, Attrs] | [CellContent, Attrs],
) => {
  if (Array.isArray(def)) {
    const [value] = def;

    if (typeof value === 'string') {
      return p(b(value));
    }

    return value;
  }

  return p(b(def));
};

const generateHeaderRow = (events: EventSpec[]) => {
  // Render the static columns
  const fixed = fixedColumns.map(([def]) => {
    const content = asArray(renderHeaderCellContent(def));

    if (Array.isArray(def)) {
      return th(def[1])(...content);
    }
    return th()(...content);
  });

  // Render each event's name and the event type
  const eventColumns = events.map(({ eventName, type }) =>
    th()(
      p(b(eventName)),
      p(status({ text: type, color: EVENT_TYPE_COLORS[type] })),
    ),
  );

  return tableRow([...fixed, ...eventColumns]);
};

const generateBodyRows = (events: EventSpec[]) => {
  return Object.entries(eventAttributeMatrix(events)).map(
    ([name, { spec: attrSpec, events: attrEvents }]) => {
      // Render each attr cell using render fn
      const attrColumns = fixedColumns.map(([, render]) => {
        return td()(...asArray(render([name, attrSpec])));
      });

      // Render each event column with a tick or cross
      const eventColumns = events.map((event: EventSpec) => {
        const eventHasAttr = Boolean(attrEvents[getEventKey(event)]);
        return td()(p(formatBooleanAsEmoji(eventHasAttr)));
      });

      return tableRow([...attrColumns, ...eventColumns]);
    },
  );
};

const generateTable = (spec: NormalizedSpec) => {
  // Only include events in the table if they match these
  const events = spec.events.filter(({ type }) =>
    EVENT_TYPE_ALLOWLIST.includes(type),
  );

  const rows = generateBodyRows(events);
  const headerRow = generateHeaderRow(events);

  return fullWithTable(headerRow, ...rows);
};

async function main() {
  /**
   * Load
   */
  const spec = yaml.load(
    readFileSync(join(process.cwd(), INPUT_FILE), {
      encoding: 'utf-8',
    }),
  );

  /**
   * Parse yml
   */

  const transformedSpec = preProcessSpec(spec);

  /**
   * Generate doc
   */

  const adfDoc = doc(
    panel({
      panelType: PanelType.INFO,
    })(
      p(
        'This page was generated from the ',
        code('analytics.spec.yaml'),
        ' from ',
        code('@atlaskit/link-picker'),
        '.',
      ),
      p('Last updated: ', date({ timestamp: `${Date.now()}` })),
    ),
    generateTable(transformedSpec),
  );

  const adfJSON = JSON.stringify(adfDoc, null, 2);

  /**
   * Prompt for auth token
   */
  const { token } = await prompt<{ token: string }>([
    {
      type: 'password',
      name: 'token',
      message: 'Confluence API Basic Auth Token',
    },
  ]);

  const CONFLUENCE_PAGE_ID = '2066943789';

  /**
   * Publish
   */

  if (typeof token === 'string' && typeof CONFLUENCE_PAGE_ID === 'string') {
    const auth = `Basic ${token}`;
    const currentVersion = await getCurrentPageVersion(
      CONFLUENCE_PAGE_ID,
      auth,
    );
    await updatePage(
      currentVersion,
      adfJSON,
      'Current Implementation: Standalone link picker',
      CONFLUENCE_PAGE_ID,
      auth,
    );
  }
}

main();
