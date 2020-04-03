import fixDoc from '../../fix-doc';

const attachments = `<span class="image-wrap" style="">
  <a
    id="262500_thumb"
    href="/secure/attachment/262500/262500_foo.png"
    title="foo.png"
    file-preview-type="image"
    file-preview-id="262500"
    file-preview-title="foo.png"
    resolved=""
  >
    <jira-attachment-thumbnail
      url="https://jdog.jira-dev.com/secure/thumbnail/262500/foo.png?default=false"
      jira-url="https://jdog.jira-dev.com/secure/thumbnail/262500/foo.png"
      filename="foo.png"
      resolved=""
    >
      <img
        alt="foo.png"
        src="https://jdog.jira-dev.com/secure/thumbnail/262500/foo.png?default=false"
        class="thumbnail-attachment"
        data-media-services-id="42"
        data-media-services-type="file"
        data-attachment-name="foo.png"
        data-attachment-type="thumbnail"
      >
    </jira-attachment-thumbnail>
  </a>
</span>
<span class="nobr">
  <a
    href="/secure/attachment/263215/263215_bar.pdf"
    title="bar.pdf attached to IR-694"
    class="file-attachment"
    data-media-services-id="42"
    data-media-services-type="file"
    data-attachment-name="bar.pdf"
    data-attachment-type="file"
  >
    bar.pdf
    <sup>
      <img
        class="rendericon"
        src="/images/icons/link_attachment_7.gif"
        height="7"
        width="7"
        align="absmiddle"
        alt=""
        border="0"
      >
    </sup>
  </a>
</span>
<span class="nobr">
  <a
    href="/secure/attachment/263212/263212_baz.png"
    title="baz.png attached to IR-694"
    data-media-services-id="42"
    data-media-services-type="file"
    data-attachment-name="baz.png"
    data-attachment-type="file"
  >
    baz.png
    <sup>
      <img
        class="rendericon"
        src="/images/icons/link_attachment_7.gif"
        height="7"
        width="7"
        align="absmiddle"
        alt=""
        border="0"
      >
      </sup>
  </a>
</span>`;

function getBody(html: string): HTMLBodyElement {
  const dom = new DOMParser().parseFromString(html, 'text/html');
  const fixedDOM = fixDoc(dom);
  return fixedDOM.querySelector('body')!;
}

// @see https://extranet.atlassian.com/pages/viewpage.action?pageId=3280965835
describe('fixDoc', () => {
  it('should match case 1', () => {
    const body = getBody(`<p>foo<br>${attachments}<br>bar</p>`);
    expect(body.children.length).toEqual(3);
  });

  it('should match case 3', () => {
    const body = getBody(`<p>${attachments}<br>bar</p>`);
    expect(body.children.length).toEqual(2);
  });

  it('should match case 3 - v2', () => {
    const body = getBody(`<p>foo<br>${attachments}</p>`);
    expect(body.children.length).toEqual(2);
  });

  it('should not match case 4', () => {
    const body = getBody(`<p>foo${attachments}<br>bar</p>`);
    expect(body.children.length).toEqual(1);
  });

  it('should not match case 5', () => {
    const body = getBody(`<p>${attachments}bar</p>`);
    expect(body.children.length).toEqual(1);
  });

  it('should maintain the position of other nodes', () => {
    const body = getBody(
      `<p>Hello</p><p>foo<br>${attachments}<br>bar</p><p>World!</p>`,
    );
    expect(body.children.length).toEqual(5);
    expect(body.children[0].textContent).toEqual('Hello');
    expect(body.children[4].textContent).toEqual('World!');
  });
});
