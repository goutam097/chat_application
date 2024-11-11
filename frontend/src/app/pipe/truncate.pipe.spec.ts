
import { TruncatePipes } from "./truncate.pipe";

describe('TruncatePipe', () => {
  it('create an instance', () => {
    const pipe = new TruncatePipes();
    expect(pipe).toBeTruthy();
  });
});
