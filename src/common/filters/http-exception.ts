import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let code = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';
    let msg;

    console.error('错误信息', exception);

    if (exception instanceof HttpException) {
      const { statusCode, error: err, message } = exception.message;
      code = statusCode;
      error = err;
      msg = message;
    }

    response.status(code).json({
      code,
      error,
      message: (chinese.test(msg) && msg) || HttpStatusText[error] || error,
    });
  }
}

// 判断是否中文
const chinese = /.*[\u4e00-\u9fa5]+.*/;

// 错误状态码中文
const HttpStatusText = {
  'Bad Request': '请求数据错误',
  'Not Found': '未找到地址',
  'Internal Server Error': '服务器错误',
};

/*
默认报错类型

Bad Request Exception 错误的请求异常
Unauthorized Exception 未经授权的例外
Not Found Exception 找不到异常
Forbidden Exception 禁止例外
Not Acceptable Exception 不可接受的例外
Request Timeout Exception 请求超时异常
Conflict Exception 冲突例外
Gone Exception 异常消失
Pay load Too Large Exception 有效负载过大
Unsupported Media Type Exception 不支持的媒体类型异常
Unprocessab le Exception 无法处理的异常
Internal Server Error Exception 内部服务器错误异常
Not Imp lemented Exception 未实施异常
Bad Gateway Exception 错误的网关异常
Service Unavailab le Exception 服务不可用异常
Gateway Timeout Exception 网关超时异常
 */
