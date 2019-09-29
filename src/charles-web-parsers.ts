import * as parser from 'fast-xml-parser';

const getStatus = (html: string) => {
  const json = parser.parse(html);
  const status = json.html.body.p; // pretty naive...
  return status;
};

export const getRecordingStatus = (html: string): boolean | null => {
  const status = getStatus(html);
  if (/Stopped/.test(status)) return false;
  if (/Recording/.test(status)) return true;
  return null;
};

export const getToolStatus = (html: string): boolean | null => {
  const status = getStatus(html);
  if (/Enabled/.test(status)) return true;
  if (/Disabled/.test(status)) return false;
  return null;
};
