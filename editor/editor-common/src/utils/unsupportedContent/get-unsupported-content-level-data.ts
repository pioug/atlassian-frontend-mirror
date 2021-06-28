import { ADFEntity, traverse } from '@atlaskit/adf-utils';

export enum UNSUPPORTED_CONTENT_LEVEL_SEVERITY {
  NORMAL = 'normal',
  DEGRADED = 'degraded',
  BLOCKING = 'blocking',
}

type UnsupportedContentLevelThresholds = {
  blocking: number;
  degraded: number;
};

export type UnsupportedContentLevelsTracking = {
  enabled: boolean;
  thresholds?: Partial<UnsupportedContentLevelThresholds>;
  samplingRates?: {
    [key: string]: number;
  };
};

export const UNSUPPORTED_CONTENT_LEVEL_SEVERITY_THRESHOLD_DEFAULTS = {
  DEGRADED: 10,
  BLOCKING: 25,
};

const buildUnsupportedContentLevelThresholds = (
  customThresholds?: UnsupportedContentLevelsTracking['thresholds'],
): UnsupportedContentLevelThresholds => {
  return {
    degraded:
      customThresholds?.degraded ||
      UNSUPPORTED_CONTENT_LEVEL_SEVERITY_THRESHOLD_DEFAULTS.DEGRADED,
    blocking:
      customThresholds?.blocking ||
      UNSUPPORTED_CONTENT_LEVEL_SEVERITY_THRESHOLD_DEFAULTS.BLOCKING,
  };
};

const countSupportedUnsupportedNodes = (validDocument: ADFEntity) => {
  let unsupportedNodes = 0;
  let supportedNodes = 0;

  traverse(validDocument, {
    any: (node) => {
      const unsupportedNodeTypes = [
        'unsupportedInline',
        'unsupportedBlock',
        'confluenceUnsupportedInline',
        'confluenceUnsupportedBlock',
      ];
      if (unsupportedNodeTypes.includes(node.type)) {
        const originalNode = node.attrs?.originalValue;
        if (originalNode) {
          // start an independent traversal for the purpose of counting
          // unsupported content nodes (with nested children contributing towards
          // that count)
          traverse(originalNode, {
            any: () => {
              unsupportedNodes++;
            },
          });
        }
        // force the parent traversal (which is counting supported content nodes)
        // to skip traversal/counting of nested children of the unsupported nodes
        return false;
      } else {
        supportedNodes++;
      }
    },
  });
  return {
    unsupportedNodes,
    supportedNodes,
  };
};

const mapUnsupportedContentLevelToSeverity = (
  unsupportedContentLevelPercent: number,
  thresholds: UnsupportedContentLevelThresholds,
) => {
  if (
    thresholds.degraded <= unsupportedContentLevelPercent &&
    unsupportedContentLevelPercent < thresholds.blocking
  ) {
    return UNSUPPORTED_CONTENT_LEVEL_SEVERITY.DEGRADED;
  }
  if (thresholds.blocking <= unsupportedContentLevelPercent) {
    return UNSUPPORTED_CONTENT_LEVEL_SEVERITY.BLOCKING;
  }
  return UNSUPPORTED_CONTENT_LEVEL_SEVERITY.NORMAL;
};

/**
 * When given a valid ADF document, this function will return an information
 * object about the level of unsupported content in the document including:
 *
 * - counts: an object with the unsupportedNodes count and supportedNodes count.
 * - percentage: the percentage of unsupported nodes in the document relative to the rest
 * of the document content
 * - severity: The percentage mapped to a string value. This string will be either
 * "normal", "degraded" or "blocking" based on the threshold rules. (For e.g. if
 * `customThresholds = { degraded: 10, blocking: 30 }`, then a document with 9%
 * unsupported content will map to "normal", a document with 14% unsupported content
 * will map to "degraded" and a document with 33% unsupported content will map to "blocking".)
 *
 * **Example usage**
 *
 * ```
 * const exampleAdf = { type: 'doc', version: 1, content: [...] };
 * const customThresholds = { degraded: 30, blocking: 50 };
 * const data = getUnsupportedContentLevelData(exampleAdf, customThresholds);
 *
 * console.log(data.severity); // "normal"
 * console.log(data.counts.percentage); // 28
 * console.log(data.counts.unsupportedNodes); // 50
 * console.log(data.counts.supportedNodes); // 129
 * ```
 *
 */
export const getUnsupportedContentLevelData = (
  validDocument: ADFEntity,
  customThresholds: UnsupportedContentLevelsTracking['thresholds'],
) => {
  const { unsupportedNodes, supportedNodes } = countSupportedUnsupportedNodes(
    validDocument,
  );
  const thresholds = buildUnsupportedContentLevelThresholds(customThresholds);
  const percentage = Math.round(
    (unsupportedNodes / (unsupportedNodes + supportedNodes)) * 100,
  );
  const severity = mapUnsupportedContentLevelToSeverity(percentage, thresholds);
  return {
    severity,
    percentage,
    counts: {
      supportedNodes,
      unsupportedNodes,
    },
  };
};
