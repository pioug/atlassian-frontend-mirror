export const escapeHtmlString = (content: string | undefined | null) => {
  if (!content) {
    return '';
  }

  const escapedContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return escapedContent;
};
