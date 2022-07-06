import { useAuth } from "context";
import { validateUserRoles } from "./validateUserRoles";

interface UseCanAccessParams {
  roles?: string[];
}

export function useCanAccess({ roles }: UseCanAccessParams): boolean {
  const { authenticatedUser, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return false;
  }

  const userHasValidRoles = validateUserRoles({ authenticatedUser, roles });

  return userHasValidRoles;
}
