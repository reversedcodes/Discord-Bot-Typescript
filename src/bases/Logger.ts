import fs from "fs";
import path from "path";
import { ILogger } from "../interfaces/ILogger";

type LogLevel = "debug" | "info" | "warn" | "error";

type LogEntry = {
    timestamp: Date;
    level: LogLevel;
    area: string;
    message: string;
    context?: any;
    error?: unknown;
};

export interface LoggerOptions {
    basePath?: string;
}

export class Logger implements ILogger {
    private buffer: Map<string, LogEntry[]> = new Map();
    private flushInterval?: NodeJS.Timeout;
    private basePath: string;

    constructor(options?: LoggerOptions) {
        this.basePath = options?.basePath || path.join(process.cwd(), "logs");
        if (!fs.existsSync(this.basePath)) {
            fs.mkdirSync(this.basePath, { recursive: true });
        }
    }

    private formatTimestamp(date: Date): string {
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    private getDateFileName(date: Date): string {
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}.log`;
    }

    private log(level: LogLevel, area: string, message: string, context?: any, error?: unknown) {
        const entry: LogEntry = {
            timestamp: new Date(),
            level,
            area,
            message,
            context,
            error,
        };

        const key = area.toLowerCase();
        if (!this.buffer.has(key)) {
            this.buffer.set(key, []);
        }

        this.buffer.get(key)!.push(entry);

        if (process.env.LOG_LEVEL === "immediate") {
            this.flush();
        }
    }

    debug(area: string, message: string, context?: any): void {
        if (process.env.LOG_LEVEL === "debug") {
            this.log("debug", area, message, context);
        }
    }

    info(area: string, message: string, context?: any): void {
        this.log("info", area, message, context);
    }

    warn(area: string, message: string, context?: any): void {
        this.log("warn", area, message, context);
    }

    error(area: string, message: string, error?: unknown, context?: any): void {
        this.log("error", area, message, context, error);
    }

    async flush(): Promise<void> {
        for (const [area, entries] of this.buffer.entries()) {
            const folder = path.join(this.basePath, area);
            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder, { recursive: true });
            }

            const fileName = this.getDateFileName(new Date());
            const filePath = path.join(folder, fileName);

            let fileContent = "";

            for (const entry of entries) {
                const time = this.formatTimestamp(entry.timestamp);
                const level = entry.level.toUpperCase();
                const ctx = entry.context ? ` | context: ${JSON.stringify(entry.context)}` : "";
                const line = `[${time}] [${level}] [${entry.area}] ${entry.message}${ctx}\n`;

                switch (entry.level) {
                    case "debug": console.debug(line.trimStart().trimEnd()); break;
                    case "info": console.info(line.trimStart().trimEnd()); break;
                    case "warn": console.warn(line.trimStart().trimEnd()); break;
                    case "error":
                        console.error(line.trimStart().trimEnd());
                        if (entry.error instanceof Error) console.error(entry.error.stack);
                        else if (entry.error) console.error(entry.error);
                        break;
                }

                fileContent += line;

                if (entry.error instanceof Error) {
                    fileContent += entry.error.stack + "\n";
                } else if (entry.error) {
                    fileContent += JSON.stringify(entry.error) + "\n";
                }
            }

            fs.appendFileSync(filePath, fileContent);
            this.buffer.set(area, []);
        }
    }

    flushEvery(ms: number): void {
        if (this.flushInterval) clearInterval(this.flushInterval);
        this.flushInterval = setInterval(() => this.flush(), ms);
    }
}
