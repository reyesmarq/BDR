import { Module } from '@nestjs/common';
import { MyTasksController } from './my-tasks.controller.js';
import { TasksController } from './tasks.controller.js';
import { TasksService } from './tasks.service.js';

@Module({
  controllers: [TasksController, MyTasksController],
  providers: [TasksService],
})
export class TasksModule {}
