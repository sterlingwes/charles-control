import * as parser from 'fast-xml-parser';

export const getStatus = (html: string) => {
  const json = parser.parse(html);
  const status = json.html.body.p; // pretty naive...
  return status;
};
