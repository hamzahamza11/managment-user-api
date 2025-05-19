// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: 'votre_secret_jwt_super_securise', // Même secret que dans auth.module.ts
//     });
//   }

//   async validate(payload: any) {
//     return { 
//       userId: payload.sub, 
//       email: payload.email, 
//       role: payload.role,
//       name: payload.name
//     };
//   }
// } 