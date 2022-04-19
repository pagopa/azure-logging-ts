import * as Transport from "winston-transport";
import * as w from "winston";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/Option";
import * as OL from "../Option";

class DummyTransport extends Transport {
  log = jest.fn();
}
const dummyTransport = new DummyTransport();

w.configure({
  level: "debug",
  transports: [dummyTransport]
});

const dummyMessage = "dummy-message";
const dummyItem = "dummy-item";

describe("index", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("do not log with none", () => {
    pipe(O.none, OL.log("info", dummyMessage));
    expect(dummyTransport.log).toBeCalledTimes(0);
  });

  it("log with string message", () => {
    const result = pipe(dummyItem, O.some, OL.log("info", dummyMessage));
    expect(result).toEqual(expect.objectContaining({ value: dummyItem }));
    expect(dummyTransport.log).toBeCalledWith(
      expect.objectContaining({ level: "info", message: dummyMessage }),
      expect.anything()
    );
  });

  it("log with function message", () => {
    const result = pipe(
      dummyItem,
      O.some,
      OL.log("info", item => `${item} ${dummyMessage}`)
    );
    expect(result).toEqual(expect.objectContaining({ value: dummyItem }));
    expect(dummyTransport.log).toBeCalledWith(
      expect.objectContaining({
        level: "info",
        message: `${dummyItem} ${dummyMessage}`
      }),
      expect.anything()
    );
  });

  it("log with none", () => {
    const result = pipe(O.none, OL.logNone("info", dummyMessage));
    expect(result).toEqual(O.none);
    expect(dummyTransport.log).toBeCalledWith(
      expect.objectContaining({
        level: "info",
        message: dummyMessage
      }),
      expect.anything()
    );
  });

  it("do not log with some", () => {
    const result = pipe(dummyItem, O.some, OL.logNone("info", dummyMessage));
    expect(result).toEqual(O.some(dummyItem));
    expect(dummyTransport.log).toBeCalledTimes(0);
  });
});