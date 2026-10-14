import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { ClerkUser } from '../auth/clerk-user.js';
import type { Resource } from '@prisma/client';
import { ResourcesService } from './resources.service.js';
import { CreateResourceDto } from './dto/create-resource.dto.js';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  create(
    @CurrentUser() user: ClerkUser,
    @Body() dto: CreateResourceDto,
  ): Promise<Resource> {
    return this.resourcesService.create(user, dto);
  }

  @Get()
  findAll(@CurrentUser() user: ClerkUser): Promise<Resource[]> {
    return this.resourcesService.findAll(user);
  }
}
