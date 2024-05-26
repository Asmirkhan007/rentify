  import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
  } from '@nestjs/common';
  import * as admin from 'firebase-admin';
  import { Property } from './property.model';
  import { sendEmail } from '../utils/email';

  @Injectable()
  export class PropertyService {
    private firestore = admin.firestore();

    async createProperty(property: Property, ownerId: string): Promise<Property> {
      try {
        property.ownerId = ownerId;
        property.likedBy = []; // Initialize likedBy as an empty array
        const propertiesCollection = this.firestore.collection('properties');
        const docRef = await propertiesCollection.add(property);
        const doc = await docRef.get();
        return { id: doc.id, ...doc.data() } as Property;
      } catch (error) {
        console.error('Error creating property:', error);
        throw new InternalServerErrorException('Failed to create property');
      }
    }

    async getAllProperties(): Promise<Property[]> {
      try {
        const propertiesCollection = this.firestore.collection('properties');
        const querySnapshot = await propertiesCollection.get();
        return querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ownerId: data.ownerId,
            place: data.place,
            area: data.area,
            numberOfBedrooms: data.numberOfBedrooms,
            numberOfBathrooms: data.numberOfBathrooms,
            price: data.price,
            likeCount: data.likeCount || 0,
            likedBy: data.likedBy || [],
          } as Property;
        });
      } catch (error) {
        console.error('Error getting properties:', error);
        throw new InternalServerErrorException('Failed to get properties');
      }
    }

    async getPropertyById(id: string): Promise<Property> {
      try {
        const doc = await this.firestore.collection('properties').doc(id).get();
        if (doc.exists) {
          const data = doc.data();
          return {
            id: doc.id,
            ownerId: data.ownerId,
            place: data.place,
            area: data.area,
            numberOfBedrooms: data.numberOfBedrooms,
            numberOfBathrooms: data.numberOfBathrooms,
            price: data.price,
            likeCount: data.likeCount || 0,
            likedBy: data.likedBy || [],
          } as Property;
        } else {
          throw new NotFoundException('Property not found');
        }
      } catch (error) {
        console.error('Error getting property by ID:', error);
        throw new InternalServerErrorException('Failed to get property by ID');
      }
    }

    async updateProperty(
      id: string,
      property: Partial<Property>,
    ): Promise<Property> {
      try {
        const propertiesCollection = this.firestore.collection('properties');
        await propertiesCollection.doc(id).update(property);
        const updatedDoc = await propertiesCollection.doc(id).get();
        return { id: updatedDoc.id, ...updatedDoc.data() } as Property;
      } catch (error) {
        console.error('Error updating property:', error);
        throw new InternalServerErrorException('Failed to update property');
      }
    }

    async deleteProperty(id: string): Promise<void> {
      try {
        await this.firestore.collection('properties').doc(id).delete();
      } catch (error) {
        console.error('Error deleting property:', error);
        throw new InternalServerErrorException('Failed to delete property');
      }
    }

    async likeProperty(id: string, userId: string): Promise<void> {
      try {
        const propertyDoc = this.firestore.collection('properties').doc(id);
        const doc = await propertyDoc.get();
        if (doc.exists) {
          const data = doc.data();
          if (!data.likedBy) {
            data.likedBy = []; // Initialize likedBy if it's not present
          }
          if (!data.likedBy.includes(userId)) {
            await propertyDoc.update({
              likeCount: admin.firestore.FieldValue.increment(1),
              likedBy: admin.firestore.FieldValue.arrayUnion(userId),
            });
          } else {
            await propertyDoc.update({
              likeCount: admin.firestore.FieldValue.increment(-1),
              likedBy: admin.firestore.FieldValue.arrayRemove(userId),
            });
          }
        } else {
          throw new NotFoundException('Property not found');
        }
      } catch (error) {
        console.error('Error liking property:', error);
        throw new InternalServerErrorException('Failed to like property');
      }
    }

    async interestedInProperty(
      propertyId: string,
      buyerId: string,
    ): Promise<any> {
      try {
        const propertyDoc = await this.firestore
          .collection('properties')
          .doc(propertyId)
          .get();
        if (propertyDoc.exists) {
          const propertyData = propertyDoc.data();
          const sellerId = propertyData.ownerId;

          const buyerDoc = await this.firestore
            .collection('users')
            .doc(buyerId)
            .get();
          const buyerData = buyerDoc.data();

          const sellerDoc = await this.firestore
            .collection('users')
            .doc(sellerId)
            .get();
          const sellerData = sellerDoc.data();

          // Send an email to the seller with the buyer's information
          const emailSubject = 'A buyer is interested in your property';
          const emailText = `Buyer Details:\n\nName: ${buyerData.firstName} ${buyerData.lastName}\nEmail: ${buyerData.email}\nPhone: ${buyerData.phoneNumber}`;
          await sendEmail(sellerData.email, emailSubject, emailText);

          // Return the seller's information to the buyer
          return {
            sellerName: `${sellerData.firstName} ${sellerData.lastName}`,
            sellerEmail: sellerData.email,
            sellerPhone: sellerData.phoneNumber,
          };
        } else {
          throw new NotFoundException('Property not found');
        }
      } catch (error) {
        console.error('Error registering interest:', error);
        throw new InternalServerErrorException('Failed to register interest');
      }
    }
  }
