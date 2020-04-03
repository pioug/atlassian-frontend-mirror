import { code, md } from '@atlaskit/docs';

export default md`
  # 7.x - 8.x

  ## API Changes

  #### Removing \`mediaApiConfig\` prop in favour of using Media Context

  The configuration for media API for render image passing \`clientId\`, \`token\` and \`baseUrl\` properties have now changed to use \`'Context'\` via \`context\` prop instead. This abstracts the API authentication process from the consumers.

  ${code`
    {
  -   mediaApiConfig: {
  -     clientId: string;
  -     token: string;
  -     baseUrl: string;
  -   },
  +   context: Context,
    }
    `}

  #### Removing \`width\` and \`height\`  props in favour of using \`apiConfig\` configuration

  The configuration for media API for render image passing \`width\` and \`height\` properties have now changed to use \`'MediaStoreGetFileImageParams'\` via \`apiConfig\` prop instead. This abstracts all the possible options for the API GET request.

  ${code`
    {
  -   width: number;
  -   height: number;
  +   apiConfig: MediaStoreGetFileImageParams,
    }
    `}

  ### Removals

  #### Remove \`className\` prop from MediaImage

  The \`className\` prop of MediaImage allowed you to specify a className via component props. Since we changed the components to use RenderProps approach, this will be solved from the package consumers.

  ${code`
+ import { MediaImage } from '@atlaskit/media-image';
+
+ <MediaImage {...props}>
+   {({ loading, error, data }) => {
+     if (loading) return <div>loading</div>;
+     if (error) return <div>error</div>;
+     return <img {...data} />;
+   }}
+ </MediaImage>
  `}

`;
