// src/properties/property.model.ts
export class Property {
  id?: string;
  ownerId: string;
  place: string;
  area: number;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  price: number;
  likeCount: number = 0;
  likedBy: string[] = []; // List of user IDs who liked the property
}
