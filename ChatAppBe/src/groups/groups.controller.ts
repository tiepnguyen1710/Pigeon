import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { CurrentUser } from '../decorators/customize';
import { deserializeUserId } from '../users/users.interface';
import type { IUser } from '../users/users.interface';

@Controller('groups')
@UseGuards(AuthGuard('jwt'))
export class GroupsController {
    constructor(private groupsService: GroupsService) {}

    @Post()
    async createGroup(
        @Body() createGroupDto: CreateGroupDto, 
        @CurrentUser() user: IUser
    ) {
        return this.groupsService.createGroup(createGroupDto, user);
    }

    @Get()
    async getMyGroups(@CurrentUser() user: IUser) {
        const userId = typeof user.id === 'bigint' ? user.id : deserializeUserId(String(user.id));
        return this.groupsService.getUserGroups(userId);
    }
}
