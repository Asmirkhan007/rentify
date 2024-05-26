import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { FirebaseAuthMiddleware } from './auth/firebase.middleware';
import { PropertyService } from './properties/property.service';
import { PropertyController } from './properties/property.controller';
import { RequestMethod } from '@nestjs/common';

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

@Module({
  imports: [],
  controllers: [AuthController, PropertyController],
  providers: [AuthService, PropertyService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
   consumer
     .apply(FirebaseAuthMiddleware)
     .forRoutes(
       { path: 'properties', method: RequestMethod.POST },
       { path: 'properties/:id', method: RequestMethod.PUT },
       { path: 'properties/:id', method: RequestMethod.DELETE },
       { path: 'properties/:id/like', method: RequestMethod.PATCH },
       { path: 'properties/:id/interested', method: RequestMethod.POST },
     );
  }
}
