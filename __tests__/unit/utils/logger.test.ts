import createLogger from "../../../src/utils/logger";
import { Console, File, FileTransportInstance } from "winston/lib/winston/transports";

afterEach(() => {
    jest.clearAllMocks();
});

jest.mock("winston", () => {
    return {
        add: jest.fn(),
        createLogger: jest.fn(),
        ...jest.requireActual("winston"),
    };
});

describe("Utils logger", () => {
    it("should test transports with prod env", () => {
        const logger = createLogger("production");
        expect(logger.transports.length).toBe(2);
        expect(logger.transports[1]).toBeInstanceOf(File);
        expect((logger.transports[1] as FileTransportInstance).dirname).toBe("var/logs");
        expect((logger.transports[1] as FileTransportInstance).filename).toBe(
            "all-logs.log"
        );
    });

    it("should test transports with development env", () => {
        const logger = createLogger("development");

        expect(logger.transports.length).toBe(3);
        expect(logger.transports[1]).toBeInstanceOf(Console);
        expect(logger.transports[2]).toBeInstanceOf(File);
        expect((logger.transports[2] as FileTransportInstance).dirname).toBe("var/logs");
        expect((logger.transports[2] as FileTransportInstance).level).toBe("error");
        expect((logger.transports[2] as FileTransportInstance).filename).toBe(
            "error.log"
        );
    });
});
