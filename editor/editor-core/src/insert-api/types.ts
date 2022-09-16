import type { Node as PMNode, Schema } from 'prosemirror-model';
import type { AnalyticsEventPayload } from '../plugins/analytics/types/events';
// import type { DefaultSchemaNodes } from '@atlaskit/adf-schema/schema-default';

export type InsertNodeConfig = {
  // TODO: ED-14676  For now, this API is be used only for table nodes.
  node: 'table'; // node: DefaultSchemaNodes | PMNode | Fragment;
  options: {
    // What: THe node inserted will be selected
    // Why: By design, the node inserted isn't select. This helps with the typing experience, for instance a follow key stroke should not replace the just-added-node but amend the current document. However, there are so cases where you may want to set the selection to the new node (e.g.: the date node, you may want to show the calendar popup.
    selectNodeInserted: boolean;

    // TODO: ED-14676 This approach to send analytics should be temporary only for the table work
    analyticsPayload?: AnalyticsEventPayload;

    // TODO: ED-14676 We will need more options to cover the known insertion edge cases like: date & panel
    /*

    // What: Send a custom message using the PluginKey coming from the handler
    // Why: Some features may need to send some additional information to allow custom UI behavior (e.g: open a popup only the node was added by shorcut)
    attachPluginMessage?: unknown;


    // What: Override where the node should be inserted.
    // Why: You may want to insert a node in a difente place than the current user selection.
    insertAt?: Selection;

    // What: Override the cursor position after the node insertion
    // Why: By default, the selection will be moved to the next available spot. For instance, for Table Nodes, the selection is moved to the first cell, but if you may want to change it for complexes nodes or specific scenarios.
    transformSelection?: (selection: Selection) => Selection;

    */
  };
};

export type InsertNodeAPI = {
  insert: (props: InsertNodeConfig) => boolean;

  // TODO: ED-14676
  // What: Allow a node to be inserted in a in-progress transaction
  // Why: Some complex operation may require more flexibility with a transaction, but still we want to keep a single insertion behavior
  // append: (props: InsertNodeConfig) => (tr: Transaction) => boolean;
};

export type CreateNodeHandler = ({
  nodeName,
  schema,
}: {
  nodeName: string;
  schema: Schema;
}) => PMNode;
