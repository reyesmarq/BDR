import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module.js';
import { AccountsController } from './accounts.controller.js';
import { AccountsService } from './accounts.service.js';

@Module({
  imports: [UsersModule],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
