import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
    Logger,
  } from '@nestjs/common';
  import { Response, Request } from 'express';
  import { QueryFailedError, EntityNotFoundError } from 'typeorm';


  @Catch(QueryFailedError, EntityNotFoundError)
  export class TypeOrmExceptionFilter implements ExceptionFilter {

    private readonly logger = new Logger(TypeOrmExceptionFilter.name);
  
    catch(exception: QueryFailedError | EntityNotFoundError, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const res = ctx.getResponse<Response>();
      const req = ctx.getRequest<Request>();
  
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Internal server error';
      let code = 'INTERNAL_ERROR';
      let meta: any = undefined;
  
      if (exception instanceof EntityNotFoundError) {
        status = HttpStatus.NOT_FOUND;
        message = 'Resource not found';
        code = 'NOT_FOUND';
      } 
      
      else if (exception instanceof QueryFailedError) {
        const drv: any = (exception as any).driverError || {};
        const errCode = drv.code || drv.errno?.toString();
  
        this.logger.error(
          `Database Error [${req.method} ${req.url}]: ${exception.message}`,
          exception.stack,
        );
  
        switch (errCode) {
          // Unique violation
          case '23505': // Postgres
          case '1062':  // MySQL
          case 'ER_DUP_ENTRY':
            status = HttpStatus.CONFLICT;
            message = 'Entry already exists';
            code = 'CONFLICT';
            break;
  
          // Foreign key violation
          case '23503':
          case '1452':
          case 'ER_NO_REFERENCED_ROW_2':
            status = HttpStatus.BAD_REQUEST;
            message = 'Invalid reference to related entity';
            code = 'FOREIGN_KEY_VIOLATION';
            break;
  
          // Not null violation
          case '23502':
            status = HttpStatus.BAD_REQUEST;
            message = 'Missing required field';
            code = 'MISSING_FIELD';
            break;
  
          // Deadlocks / Serialization failures (Retryable)
          case '40001':
          case '40P01':
            status = HttpStatus.SERVICE_UNAVAILABLE;
            message = 'Temporary database conflict. Please retry.';
            code = 'DB_CONCURRENCY_ERROR';
            meta = { retryable: true };
            break;
  
          default:
            message = 'Database query failed';
            code = 'DB_ERROR';
        }
      }
  
      res.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: req.url,
        message: message,
        code: code,
        meta: meta,
      });
    }
  }