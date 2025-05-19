import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Application } from '../../applications/entities/application.entity';
import { Permission } from '../../permissions/entities/permission.entity';
import * as bcrypt from 'bcrypt';

export async function seedInitialData(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const applicationRepository = dataSource.getRepository(Application);
  const permissionRepository = dataSource.getRepository(Permission);

  try {
    // Create admin user if not exists
    let adminUser = await userRepository.findOne({ where: { email: 'admin@example.com' } });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      adminUser = await userRepository.save({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        is_active: true
      });
      console.log('Admin user created:', adminUser.id);
    }

    // Create management app if not exists
    let managementApp = await applicationRepository.findOne({ where: { name: 'management_app' } });
    if (!managementApp) {
      managementApp = await applicationRepository.save({
        name: 'management_app',
        description: 'User management application'
      });
      console.log('Management app created:', managementApp.id);
    }

    // Create admin permission if not exists
    const existingPermission = await permissionRepository.findOne({
      where: {
        userId: adminUser.id,
        applicationId: managementApp.id
      }
    });

    if (!existingPermission) {
      await permissionRepository.save({
        userId: adminUser.id,
        applicationId: managementApp.id,
        permissionType: 'admin'
      });
      console.log('Admin permission created for management app');
    }
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
} 