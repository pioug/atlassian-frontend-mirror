/**
 * AGG query to retrieve incoming/outgoing links from AGS
 * https://developer.atlassian.com/cloud/ari-graph-store/relationships/content-referenced-entity/#batch-query
 */
export const queryIncomingOutgoingLinks = `
  query SmartCard_ContentReferencedEntityBatchQuery_V1($ids: [ID!]!, $firstIncoming: Int = 50, $firstOutgoing: Int = 50) {
    graphStore @optIn(to: "GraphStore") {
      incoming: contentReferencedEntityInverseBatch(ids: $ids, first: $firstIncoming) @optIn(to: "GraphStoreContentReferencedEntity") {
        nodes {
          from {
            id
          }
        }
      }
      outgoing: contentReferencedEntityBatch(ids: $ids, first: $firstOutgoing) @optIn(to: "GraphStoreContentReferencedEntity") {
        nodes {
          to {
            id
          }
        }
      }
    }
  }`;
