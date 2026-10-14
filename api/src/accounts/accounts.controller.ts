import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { ClerkUser } from '../auth/clerk-user.js';
import type { Account } from '@prisma/client';
import { AccountsService } from './accounts.service.js';
import { CreateAccountDto } from './dto/create-account.dto.js';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(
    @CurrentUser() user: ClerkUser,
    @Body() dto: CreateAccountDto,
  ): Promise<Account> {
    return this.accountsService.create(user, dto);
  }

  @Get()
  findAll(@CurrentUser() user: ClerkUser): Promise<Account[]> {
    return this.accountsService.findAll(user);
  }

  @Get(':id')
  async findOne(@CurrentUser() user: ClerkUser, @Param('id') id: string) {
    const account = await this.accountsService.findOne(user, id);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }
}
