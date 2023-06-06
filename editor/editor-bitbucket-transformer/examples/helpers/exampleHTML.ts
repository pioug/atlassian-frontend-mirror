const html = `<p>Regular,
  <strong>Strong</strong>,
  <em>Italic</em>,
  <a href="/abodera/" rel="nofollow" title="@abodera" class="mention mention-me">Artur Bodera</a>,
  <em><strong>Strong Italic</strong></em>
</p>

<hr>

<p>Atlassian ID mentions</p>
<ul>
  <li><a href="/scott" class="mention" data-atlassian-id="5c09bf77ec71bd223bbe866f">@Scott Demo</a></li>
  <li><a href="/scott" class="ap-mention" data-atlassian-id="5c09bf77ec71bd223bbe866f">@Scott Demo</a></li>
  <li><span class="ap-mention" data-atlassian-id="5c09bf77ec71bd223bbe866f">@Scott Demo</span></li>
</ul>

<hr>

<p><a href="//atlassian.com" data-is-external-link="true">Regular link</a>,
  <a href="//atlassian.com" data-is-external-link="true"><strong>strong link</strong></a>,
  <a href="//atlassian.com" data-is-external-link="true"><em><strong>strong italic link</strong></em></a>
</p>

<hr>

<ul>
    <li>Bullet list item 1</li>
    <li>Bullet list item 2</li>
</ul>

<hr>

<ol>
    <li>Number list item 1</li>
    <li>Number list item 2</li>
</ol>

<hr>

<pre><code>private handleChange = () => {
  const { onChange } = this.props;
  if (onChange) {
    onChange(this);
  }
}</code></pre>

<hr>

<blockquote>
  <p>Block quote first paragraph</p>
  <p>Regular,
    <strong>Strong</strong>,
    <em>Italic</em>,
    <em><strong>Strong Italic</strong></em>
  </p>
  <ul>
    <li>Bullet list item 1</li>
    <li>Bullet list item 2</li>
  </ul>
  <ol>
    <li>Number list item 1</li>
    <li>Number list item 2</li>
  </ol>
</blockquote>

<hr>

<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6</h6>

<p>Emoji <img src="https://d301sr5gafysq2.cloudfront.net/207268dc597d/emoji/img/diamond_shape_with_a_dot_inside.svg"
 alt="diamond shape with a dot inside" title="diamond shape with a dot inside" class="emoji"> example</p>

<p>How about an image? <img src="https://d301sr5gafysq2.cloudfront.net/207268dc597d/emoji/img/diamond_shape_with_a_dot_inside.svg"></p>
`;

export default html;
