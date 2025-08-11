// import {
//   Injectable,
//   CanActivate,
//   ExecutionContext,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { PrismaService } from '../../../../prisma/prisma.service';

// @Injectable()
// export class ApiKeyGuard implements CanActivate {
//   constructor(private readonly prisma: PrismaService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const req = context.switchToHttp().getRequest();
//     const apiKey = req.headers['x-api-key'];

//     if (!apiKey || typeof apiKey !== 'string') {
//       throw new UnauthorizedException('API key missing');
//     }

//     const user = await this.prisma.user.findUnique({ where: { apiKey } });

//     if (!user) {
//       throw new UnauthorizedException('Invalid API key');
//     }

//     req.user = user;
//     return true;
//   }
// }

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const apiKey = request.headers['x-api-key'] || request.headers['X-API-KEY'];
    if (!apiKey || typeof apiKey !== 'string') {
      throw new UnauthorizedException('API key is missing');
    }

    // Look up API key in DB and fetch associated user
    const user = await this.prisma.user.findUnique({
      where: { apiKey: apiKey.trim() },
      select: { id: true, email: true, role: true }, // whatever user info you want to attach
    });

    if (!user) {
      throw new UnauthorizedException('Invalid API key');
    }

    // Attach user info to request for downstream usage
    request.user = user;

    return true;
  }
}
