import React, { useEffect, useState } from 'react';

// import { DocNode } from '@atlaskit/adf-schema';
import { ExtensionParams } from '@atlaskit/editor-common';

// import { ExtensionKeys } from './constants';
// import { ExtensionLinkComponent } from './ExtensionLinkComponent';
import MacroComponent from './MacroComponent';

// const shouldRenderAsLink = (extensionKey: string) => {
//   return [
//     ExtensionKeys.GOOGLE_DOCS,
//     ExtensionKeys.GOOGLE_SHEETS,
//     ExtensionKeys.GOOGLE_SLIDES,
//     ExtensionKeys.TRELLO_CARD,
//     ExtensionKeys.TRELLO_BOARD,
//   ].includes(extensionKey);
// };

const withLegacyMobileMacros = <
  P extends object,
  createPromiseType extends Function,
  eventDispatcherType
>(
  Component: React.ComponentType<P>,
  createPromise: createPromiseType,
  eventDispatcher: eventDispatcherType,
  enableLegacyMobileMacros?: boolean,
): React.FC<P> => (props: P) => {
  if (!enableLegacyMobileMacros) {
    return <Component {...props} />;
  }

  const [macroWhitelist, setMacroWhitelist] = useState([]);

  useEffect(() => {
    createPromise('customConfigurationMacro')
      .submit()
      .then((result: any) => {
        var resultObj = JSON.parse(JSON.stringify(result));
        /*
          The workaround below is for iOS
          The returned from iOS is wrapped as an Object with the key being resultId:
          {
            "<request id>": {
              "contentId": "...",
              "macroWhiteList": []
            }
          }
          Since the value of the requestId is not a constant we take the value of the
          first key in the result and pass it as the result Object.
        */
        // Format the object ony if there is no key called `macroWhitelist` in the result Object
        if (
          !('macroWhitelist' in resultObj) &&
          Object.keys(resultObj).length > 0
        ) {
          const firstKey = Object.keys(resultObj)[0];
          resultObj = resultObj[firstKey];
        }

        setMacroWhitelist(resultObj.macroWhitelist);
      });
  }, []);

  // const nestedRender = (document: DocNode) => {
  //   const params = {
  //     ...props,
  //     document,
  //   };
  //   return <Component {...params} />;
  // };

  const getMacroExtensionHandler = () => {
    return (extension: ExtensionParams<any>) => (
      // NOTE: Rendering as link disabled until we can fix setContent overriding
      //       nested renderer content
      // shouldRenderAsLink(extension.extensionKey) ? (
      //   <ExtensionLinkComponent extension={extension} render={nestedRender} />
      // ) : (
      <MacroComponent
        extension={extension}
        macroWhitelist={macroWhitelist}
        createPromise={createPromise}
        eventDispatcher={eventDispatcher}
      />
    );
  };

  const getExtensionHandlers = () => {
    return {
      'com.atlassian.confluence.macro.core': getMacroExtensionHandler(),
    };
  };

  const params = {
    ...props,
    extensionHandlers: getExtensionHandlers(),
  };

  return <Component {...params} />;
};

export { withLegacyMobileMacros };
