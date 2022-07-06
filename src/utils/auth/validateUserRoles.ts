import { AuthenticatedUser } from "context";

type ValidateUserRolesParams = {
  authenticatedUser: AuthenticatedUser;
  roles?: string[];
};

export function validateUserRoles({
  authenticatedUser,
  roles,
}: ValidateUserRolesParams) {
  if (roles?.length > 0) {
    const hasThisRole = roles.some((role) => {
      return authenticatedUser.role?.name === role;
    });

    if (!hasThisRole) {
      return false;
    }
  }
  return true;
}
