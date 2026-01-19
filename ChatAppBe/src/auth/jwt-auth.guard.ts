import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorators/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
      }
    //call before controller, add logic before auth
    canActivate(context: ExecutionContext) {
        // Add your custom authentication logic here
        // for example, call super.logIn(request) to establish a session.
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
          ]);
          if (isPublic) {
            return true;
          }
          return super.canActivate(context);
      }
    
      handleRequest(err, user, info) {
        // console.log('JWT Guard - err:', err);
        // console.log('JWT Guard - user:', user);
        // console.log('JWT Guard - info:', info);
        
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
          //console.error('JWT Guard - Authentication failed:', { err, user, info });
          throw err || new UnauthorizedException("Token is not valid!");
        }
        return user;
      }
}
