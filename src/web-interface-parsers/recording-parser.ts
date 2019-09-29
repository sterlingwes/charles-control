import { getStatus } from './base-parser';

export const getRecordingStatus = (html: string): boolean => {
  const status = getStatus(html);
  return /Stopped/.test(status) === false;
};
