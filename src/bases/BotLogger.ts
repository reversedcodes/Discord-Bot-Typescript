import { Logger } from "./Logger";

export class BotLogger {
    private logger: Logger;
    private readonly area = "Bot";

    constructor(logger: Logger) {
        this.logger = logger;
    }

    info(message: string, context?: any): void {
        this.logger.info(this.area, message, context);
    }

    warn(message: string, context?: any): void {
        this.logger.warn(this.area, message, context);
    }

    error(message: string, error?: unknown, context?: any): void {
        this.logger.error(this.area, message, error, context);
    }

    debug(message: string, context?: any): void {
        this.logger.debug(this.area, message, context);
    }

    flush(): Promise<void> {
        return this.logger.flush();
    }

    flushEvery(ms: number): void {
        this.logger.flushEvery(ms);
    }
}
