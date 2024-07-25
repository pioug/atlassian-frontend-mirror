/**
 * AGG query to retrieve incoming/outgoing links from AGS
 * https://developer.atlassian.com/cloud/ari-graph-store/relationships/content-referenced-entity/#batch-query
 */
export const queryIncomingOutgoingLinks = `
  query SmartCard_ContentReferencedEntity_V1($id: ID!, $firstIncoming: Int = 50, $firstOutgoing: Int = 50) {
    graphStore @optIn(to: "GraphStore") {
      incoming: contentReferencedEntityInverse(
        id: $id
        first: $firstIncoming
        sort: {lastModified: {direction: DESC, priority: 1}}
      ) @optIn(to: "GraphStoreContentReferencedEntity") {
        aris: edges {
          id
        }
      }
      outgoing: contentReferencedEntity(
        id: $id
        first: $firstOutgoing
        sort: {lastModified: {direction: DESC, priority: 1}}
      ) @optIn(to: "GraphStoreContentReferencedEntity") {
        aris: edges {
          id
        }
      }
    }
  }`;
