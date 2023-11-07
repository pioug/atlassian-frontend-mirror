import type { EditorProps } from '../types/editor-props';

export default function editorDeprecationWarnings(props: EditorProps) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  const deprecatedProperties = {
    allowTasksAndDecisions: {
      message:
        'To allow tasks and decisions use taskDecisionProvider – <Editor taskDecisionProvider={{ provider }} />',
      type: 'removed',
    },

    allowConfluenceInlineComment: {
      message:
        'To integrate inline comments use experimental annotationProvider – <Editor annotationProviders={{ provider }} />',
      type: 'removed',
    },

    smartLinks: {
      message:
        'To use smartLinks, pass the same object into the smartlinks key of linking - <Editor linking={{ smartLinks: {existing object} }}.',
      type: 'removed',
    },
  };

  (
    Object.keys(deprecatedProperties) as Array<
      keyof typeof deprecatedProperties
    >
  ).forEach((property) => {
    if (props.hasOwnProperty(property)) {
      const meta: { type?: string; message?: string } =
        deprecatedProperties[property];
      const type = meta.type || 'enabled by default';

      // eslint-disable-next-line no-console
      console.warn(
        `${property} property is deprecated. ${
          meta.message || ''
        } [Will be ${type} in the next major editor-core version]`,
      );
    }
  });

  if (
    props.hasOwnProperty('allowTables') &&
    typeof props.allowTables !== 'boolean' &&
    (!props.allowTables || !props.allowTables.advanced)
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      `Advanced table options are deprecated (except isHeaderRowRequired) to continue using advanced table features use - <Editor allowTables={{ advanced: true }} /> [Will be changed in the next major editor-core version]`,
    );
  }
}
