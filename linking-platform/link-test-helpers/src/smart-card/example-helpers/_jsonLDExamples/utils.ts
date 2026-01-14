const content = `
<html>
  <body style="font-family:sans-serif;text-align:center;background-color:#091E4208">
    VR TEST: EMBED CONTENT
  </body>
</html>
`;
const encodedContent = encodeURIComponent(content);
export const overrideEmbedContent: string = `data:text/html;charset=utf-8,${encodedContent}`;
