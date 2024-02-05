import config from '../config';
import { UserRole } from '../module/users/users.constants';
import { UserModel } from '../module/users/users.model';

const superUser = {
  id: '0000',
  email: 's19hossain98@gmail.com',
  password: config.super_admin_password,
  needsPasswordChange: false,
  role: UserRole.superAdmin,
  status: 'in-progress',
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  const isSuperAdminExists = await UserModel.findOne({
    role: UserRole.superAdmin,
  });
  if (!isSuperAdminExists) {
    await UserModel.create(superUser);
  }
};

export default seedSuperAdmin;
