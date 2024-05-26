import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Req,
  Patch,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { Property } from './property.model';
import { CustomRequest } from '../types/express-request.interface';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  async createProperty(@Body() property: Property, @Req() req: CustomRequest) {
    // Ensure ownerId is provided correctly
    const ownerId = req.body.ownerId || req.user?.uid;
    return this.propertyService.createProperty(property, ownerId);
  }

  @Get()
  async getProperties() {
    return this.propertyService.getAllProperties();
  }

  @Get(':id')
  async getPropertyById(@Param('id') id: string) {
    return this.propertyService.getPropertyById(id);
  }

  @Put(':id')
  async updateProperty(
    @Param('id') id: string,
    @Body() property: Partial<Property>,
    @Req() req: CustomRequest,
  ) {
    const ownerId = req.body.ownerId || req.user?.uid;
    return this.propertyService.updateProperty(id, property);
  }

  @Delete(':id')
  async deleteProperty(@Param('id') id: string) {
    return this.propertyService.deleteProperty(id);
  }

  @Patch(':id/like')
  async likeProperty(@Param('id') id: string, @Req() req: CustomRequest) {
    const userId = req.body.userId || req.user?.uid;
    await this.propertyService.likeProperty(id, userId);
  }

  @Post(':id/interested')
  async interestedInProperty(
    @Param('id') id: string,
    @Req() req: CustomRequest,
  ) {
    const buyerId = req.body.buyerId || req.user?.uid;
    return this.propertyService.interestedInProperty(id, buyerId);
  }
}
