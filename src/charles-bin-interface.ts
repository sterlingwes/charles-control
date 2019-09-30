import { execSync } from 'child_process';

export const DEFAULT_CHARLES_PATH = '/Applications/Charles.app';
const BIN_PATH = '/Contents/MacOS/Charles';

const getCharlesBinLocation = () => `${process.env.CHARLES_PATH || DEFAULT_CHARLES_PATH}${BIN_PATH}`;

const run = (command: string) => {
  return execSync(`${getCharlesBinLocation()} ${command}`, { encoding: 'utf8' });
};

export const getVersion = () => {
  const output = run('-v');
  const [, version] = output.match(/Charles Proxy ([0-9.]+)/) || [];
  return version;
};
