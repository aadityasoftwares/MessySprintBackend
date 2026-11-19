import prisma from '../../../config/db.js';
import AppError from '../../../utils/AppError.js';

export class UserProfileService {
  async getProfile(userId) {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            status: true,
            role: true,
          },
        },
      },
    });

    if (!profile) {
      throw new AppError('User profile not found', 404);
    }

    return profile;
  }

  async updateProfile(userId, data) {
    const {
      firstName,
      lastName,
      displayName,
      bio,
      avatarUrl,
      dateOfBirth,
      occupation,
      education,
      interests,
      timezone,
      language,
    } = data;

    return prisma.userProfile.upsert({
      where: { userId },
      update: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        displayName: displayName ?? `${firstName ?? ''} ${lastName ?? ''}`.trim(),
        ...(bio !== undefined && { bio }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
        ...(occupation !== undefined && { occupation }),
        ...(education !== undefined && { education }),
        ...(interests !== undefined && { interests }),
        ...(timezone && { timezone }),
        ...(language && { language }),
      },
      create: {
        userId,
        firstName: firstName || 'User',
        lastName: lastName || '',
        displayName: displayName || firstName || 'User',
        bio,
        avatarUrl,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        occupation,
        education,
        interests: interests || [],
        timezone: timezone || 'UTC',
        language: language || 'en',
      },
    });
  }
}

export default UserProfileService;
