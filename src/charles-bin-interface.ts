import { execSync } from 'child_process';

export const DEFAULT_CHARLES_PATH = '/Applications/Charles.app/Contents/MacOS/Charles';

const getCharlesLocation = () => process.env.CHARLES_PATH || DEFAULT_CHARLES_PATH;

const run = (command: string) => {
  return execSync(`${getCharlesLocation()} ${command}`, { encoding: 'utf8' });
};

export const getVersion = () => {
  const output = run('-v');
  const [, version] = output.match(/Charles Proxy ([0-9.]+)/) || [];
  return version;
};
