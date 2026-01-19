import { Injectable, CanActivate, ExecutionContext, ForbiddenException, BadRequestException } from "@nestjs/common";
import { GroupsService } from "./groups.service";

@Injectable()
export class GroupMemberGuard implements CanActivate {
    constructor(
        private groupsService: GroupsService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.id) {
            throw new ForbiddenException('User not authenticated');
        }

        const groupId = request.body?.groupId || request.params?.groupId || request.query?.groupId;

        if (!groupId) {
            throw new BadRequestException('groupId is required');
        }

        const groupExists = await this.groupsService.groupExists(groupId);
        if (!groupExists) {
            throw new BadRequestException('Group not found');
        }

        const isMember = await this.groupsService.isMember(groupId, user.id);
        if (!isMember) {
            throw new ForbiddenException('You are not a member of this group');
        }
        request.groupId = groupId;

        return true;
    }
}