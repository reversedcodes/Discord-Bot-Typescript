
export interface ILogger {
    debug(area: string, message: string, context?: any): void;
    info(area: string, message: string, context?: any): void;
    warn(area: string, message: string, context?: any): void;
    error(area: string, message: string, error?: unknown, context?: any): void;
  
    flush(): Promise<void>;
    flushEvery(ms: number): void;
  }
  