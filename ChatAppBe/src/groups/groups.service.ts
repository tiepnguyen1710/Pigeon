import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { IUser, deserializeUserId, serializeUserId } from '../users/users.interface';

// Helper to serialize all BigInt fields in an object recursively
function serializeBigInts(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'bigint') return obj.toString();
    if (Array.isArray(obj)) return obj.map(serializeBigInts);
    if (typeof obj === 'object') {
        const result: any = {};
        for (const key in obj) {
            result[key] = serializeBigInts(obj[key]);
        }
        return result;
    }
    return obj;
}

@Injectable()
export class GroupsService {
    constructor(private prisma: PrismaService) {}

    async createGroup(createGroupDto: CreateGroupDto, user: IUser) {
        const { name, avatarUrl } = createGroupDto;
        
        // Convert user.id to BigInt (it comes as string from JWT)
        const userId = typeof user.id === 'bigint' ? user.id : deserializeUserId(String(user.id));

        const newGroup = await this.prisma.$transaction(async (tx) => {
            const group = await tx.group.create({
                data: {
                    name,
                    avatarUrl: avatarUrl || null,
                    ownerId: userId,
                },
            });

            await tx.groupMember.create({
                data: {
                    groupId: group.id,
                    userId: userId,
                    role: 'owner',
                },
            });

            return group;
        });

        return serializeBigInts(newGroup);
    }

    async getGroupById(groupId: bigint | number) {
        const group = await this.prisma.group.findUnique({
            where: { id: BigInt(groupId) },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                avatar: true,
                            }
                        }
                    }
                },
                owner: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    }
                }
            }
        });

        return serializeBigInts(group);
    }

    async getUserGroups(userId: bigint | number) {
        const userIdBigInt = BigInt(userId);
        
        const groups = await this.prisma.group.findMany({
            where: {
                members: {
                    some: {
                        userId: userIdBigInt,
                        leftAt: null,
                    }
                }
            },
            include: {
                members: {
                    where: { leftAt: null },
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                avatar: true,
                            }
                        }
                    }
                },
                owner: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    }
                }
            }
        });

        return groups.map(serializeBigInts);
    }


    async groupExists(groupId: bigint | number | string): Promise<boolean> {
        const group = await this.prisma.group.findUnique({
            where: { id: BigInt(groupId) },
            select: { id: true },
        });
        return !!group;
    }

    async isMember(groupId: bigint | number | string, userId: bigint | number | string): Promise<boolean> {
        const member = await this.prisma.groupMember.findFirst({
            where: {
                groupId: BigInt(groupId),
                userId: BigInt(userId),
                leftAt: null,
            },
            select: { groupId: true },
        });
        return !!member;
    }
}
