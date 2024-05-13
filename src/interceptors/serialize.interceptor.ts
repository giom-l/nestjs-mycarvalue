import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Alternative with generics
export function Serialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor<T>(dto));
}

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}

  intercept(
    context: ExecutionContext,
    handler: CallHandler<T>,
  ): Observable<T> | Promise<Observable<T>> {
    return handler.handle().pipe(
      map((data: T) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}

// Ensure any type passed to the decorator is a class
// interface ClassConstructor {
//   new (...args: any[]): object;
// }

// Make a function that will simplify the usage of our interceptor
// export function Serialize(dto: ClassConstructor) {
//   return UseInterceptors(new SerializeInterceptor(dto));
// }

// export class SerializeInterceptor implements NestInterceptor {
//   constructor(private dto: any) {}
//   intercept(
//     context: ExecutionContext,
//     handler: CallHandler<any>,
//   ): Observable<any> | Promise<Observable<any>> {
//     // Run something before the request before the request is handlede by the requestHandler
//     // console.log(
//     //   "[SerializeInterceptor In] I'm running before the handler",
//     //   context,
//     // );

//     return handler.handle().pipe(
//       map((data: any) => {
//         //Run something before the response is sent out.
//         // Data is the response we'll send back
//         // console.log(
//         //   "[SerializeInterceptor Out] I'm running before response is sent out : ",
//         //   data,
//         // );
//         return plainToInstance(this.dto, data, {
//           excludeExtraneousValues: true,
//         });
//       }),
//     );
//   }
// }
