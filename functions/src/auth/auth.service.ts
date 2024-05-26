import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor() {}

  async signup(createUserDto: CreateUserDto) {
    const { email, password, firstName, lastName, phoneNumber, role } =
      createUserDto;

    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
      phoneNumber,
    });

    // Store additional user info in Firestore
    const userRef = admin.firestore().collection('users').doc(userRecord.uid);
    await userRef.set({
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
    });

    return { uid: userRecord.uid, email: userRecord.email };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    // Implement custom logic for Firebase authentication if needed
  }
}
