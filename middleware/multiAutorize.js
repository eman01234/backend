import rolesPermissions from "../utils/rolesPermissions.js";
const authorizeMultipleRoles = (roles, resource, action) => {
  return (req, res, next) => {
    for (const role of roles) {
      const rolePermissions = rolesPermissions[role];
      if (rolePermissions) {
        const resourcePermissions = rolePermissions.resources[resource];
        if (resourcePermissions && resourcePermissions.includes(action)) {
          return next(); // Allow access if any role has the required permission
        }
      }
    }
    return res.status(403).json({ message: "Permission denied" });
  };
};
export default authorizeMultipleRoles;
