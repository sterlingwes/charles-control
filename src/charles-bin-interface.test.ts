import * as Proc from 'child_process';
import { getVersion, DEFAULT_CHARLES_PATH } from './charles-bin-interface';

jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

const mockedProc = Proc as jest.Mocked<typeof Proc>;

describe('Charles bin interface', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getVersion', () => {
    const mockOutput = `Security framework of XStream not initialized, XStream is probably vulnerable.
Charles Proxy 4.2.1`;

    beforeEach(() => {
      mockedProc.execSync.mockReturnValueOnce(mockOutput as any);
    });

    it('should return the semver part', () => {
      expect(getVersion()).toBe('4.2.1');
      expect(mockedProc.execSync).toBeCalledWith(
        `${DEFAULT_CHARLES_PATH}/Contents/MacOS/Charles -v`,
        expect.objectContaining({ encoding: 'utf8' }),
      );
    });
  });
});
