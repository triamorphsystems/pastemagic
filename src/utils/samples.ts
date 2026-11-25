export interface SampleItem {
  id: string;
  title: string;
  category: string;
  html: string;
}

export const SAMPLES: SampleItem[] = [
  {
    id: 'messy-article',
    title: 'Messy Blog Post (Font, Color & UTM Links)',
    category: 'Web Article',
    html: `<div style="font-family: 'Comic Sans MS', cursive, sans-serif; background-color: #fdf2e9; padding: 25px; line-height: 2.2;">
  <!-- Blog header with weird font size and colors -->
  <h1 style="color: #c0392b; font-size: 34.4px; font-family: Impact, fantasy; text-shadow: 2px 2px #f1c40f;">
    🚀 10 Tips for <span style="background-color: #ffff00; color: #8e44ad;">Better Productivity</span> in 2026!
  </h1>

  <p style="font-size: 17.5px; color: #2c3e50; margin-top: 15px;">
    When you copy text from online blogs, you usually end up with 
    <strong style="color: #e67e22; font-size: 19px;">unwanted inline fonts</strong>, 
    <em style="background-color: #a3e4d7; color: #117864;">garish neon highlighter colors</em>, 
    and bloated tracking tags that mess up your Google Docs and Word documents.
  </p>

  <h2 style="color: #2980b9; font-size: 26.2px; font-family: 'Times New Roman', serif;">
    Key Takeaways
  </h2>

  <ul style="background-color: #ebdef0; padding: 15px 30px; border: 2px dashed #8e44ad;">
    <li style="color: #27ae60; font-weight: bold; margin-bottom: 8px;">
      ✅ Clean up formatting without using plain Notepad!
    </li>
    <li style="color: #d35400; margin-bottom: 8px;">
      ⚡ Preserve essential <strong>bolding</strong> and <em>italics</em>.
    </li>
    <li style="color: #2c3e50; margin-bottom: 8px;">
      🔗 Check this resource: 
      <a href="https://example.com/guide?utm_source=newsletter&utm_medium=email&utm_campaign=summer_sale&utm_content=btn1&fbclid=IwAR3xY72910" style="color: #e74c3c; font-size: 18px; text-decoration: underline;">
        Read the Full Guide
      </a> (with ugly UTM tracking tags attached!).
    </li>
  </ul>

  <blockquote style="background-color: #e8f8f5; border-left: 6px solid #1abc9c; padding: 12px 20px; font-style: italic; color: #16a085;">
    “Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.”
  </blockquote>
</div>`,
  },
  {
    id: 'word-doc',
    title: 'Microsoft Word Cruft (MsoNormal & Smart Quotes)',
    category: 'Word Document',
    html: `<!--[if gte mso 9]><xml><w:WordDocument><w:View>Normal</w:View></w:WordDocument></xml><![endif]-->
<p class="MsoNormal" style="margin-bottom:0in;line-height:normal;font-size:11.0pt;font-family:'Calibri',sans-serif;mso-ascii-theme-font:minor-latin;mso-fareast-font-family:'Times New Roman';mso-hansi-theme-font:minor-latin;mso-bidi-font-family:'Times New Roman';color:#1F497D">
  <b style="mso-bidi-font-weight:normal"><span style="font-size:14.0pt;font-family:'Segoe UI',sans-serif;color:#365F91">Project Status Briefing – Q4 Goals</span></b>
</p>
<p class="MsoNormal" style="margin-bottom:0in;line-height:normal;font-size:11.0pt;font-family:'Calibri',sans-serif;">
  <span style="font-size:10.5pt;font-family:'Segoe UI',sans-serif;color:#595959">
    The team’s “deliverables” must be submitted before Friday’s deadline. Notice the curly ‘smart quotes’ and invisible&#8203; zero&#8203;-width&#8203; spaces inserted by Office editors.
  </span>
</p>
<p class="MsoListParagraph" style="text-indent:-.25in;mso-list:l0 level1 lfo1;margin-left:.5in;line-height:normal;font-size:11.0pt;font-family:'Calibri',sans-serif;">
  <span style="font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:Symbol">·<span style="font:7.0pt 'Times New Roman'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span>
  <b>Phase 1:</b> Finalize architecture design and database schema.
</p>
<p class="MsoListParagraph" style="text-indent:-.25in;mso-list:l0 level1 lfo1;margin-left:.5in;line-height:normal;font-size:11.0pt;font-family:'Calibri',sans-serif;">
  <span style="font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:Symbol">·<span style="font:7.0pt 'Times New Roman'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span>
  <b>Phase 2:</b> Build high-fidelity user interface with live feedback.
</p>`,
  },
  {
    id: 'google-docs',
    title: 'Google Docs Nested Spans & Highlight',
    category: 'Google Docs',
    html: `<b id="docs-internal-guid-82194b1a-7fff-9b21-4d92-ec5c0d5b3d68" style="font-weight:normal;">
  <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;">
    <span style="font-size:18pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Product Feature Matrix</span>
  </p>
  <p dir="ltr" style="line-height:1.38;margin-top:12pt;margin-bottom:0pt;">
    <span style="font-size:11pt;font-family:Arial,sans-serif;color:#434343;background-color:#fff2cc;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">This note was highlighted in bright yellow in Google Docs with 11pt Arial text. </span>
    <span style="font-size:11pt;font-family:Arial,sans-serif;color:#1155cc;background-color:transparent;font-weight:700;font-style:italic;text-decoration:underline;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">PasteMagic detects and preserves the bold and italic while stripping the ugly yellow highlight!</span>
  </p>
  <p dir="ltr" style="line-height:1.38;margin-top:12pt;margin-bottom:0pt;">
    <span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;text-decoration:none;">Here is some code: </span>
    <code style="font-family:'Courier New',monospace;background-color:#f3f3f3;padding:2px 4px;">const clean = sanitize(clipboard);</code>
  </p>
</b>`,
  },
  {
    id: 'styled-table',
    title: 'Messy Data Table with Inline Backgrounds',
    category: 'Data Table',
    html: `<table style="width: 100%; border-collapse: collapse; background-color: #f8f9fa; font-family: 'Verdana', sans-serif;">
  <thead>
    <tr style="background-color: #34495e; color: #ecf0f1;">
      <th style="padding: 12px; border: 2px solid #2c3e50; font-size: 15px;">Item</th>
      <th style="padding: 12px; border: 2px solid #2c3e50; font-size: 15px;">Status</th>
      <th style="padding: 12px; border: 2px solid #2c3e50; font-size: 15px;">Reference Link</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: #ffffff;">
      <td style="padding: 10px; border: 1px solid #bdc3c7; color: #2c3e50;"><strong>Core Engine</strong></td>
      <td style="padding: 10px; border: 1px solid #bdc3c7; color: #27ae60; font-weight: bold;">Completed</td>
      <td style="padding: 10px; border: 1px solid #bdc3c7;">
        <a href="https://github.com/example/engine?utm_source=dashboard&ref=promo" style="color: #2980b9;">Engine Docs</a>
      </td>
    </tr>
    <tr style="background-color: #f2f4f4;">
      <td style="padding: 10px; border: 1px solid #bdc3c7; color: #2c3e50;"><strong>Filter Settings</strong></td>
      <td style="padding: 10px; border: 1px solid #bdc3c7; color: #2980b9; font-weight: bold;">Active</td>
      <td style="padding: 10px; border: 1px solid #bdc3c7;">
        <a href="https://example.com/settings?utm_campaign=winter2026" style="color: #2980b9;">Filter Specs</a>
      </td>
    </tr>
  </tbody>
</table>`,
  },
];

