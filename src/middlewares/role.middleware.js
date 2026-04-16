/**
 * TODO: Check if user has required role
 *
 * This middleware factory takes role(s) and returns a middleware function
 *
 * 1. Return a middleware function that accepts (req, res, next)
 * 2. Check if req.user exists
 *    - If not: return 401 with { error: { message: "Not authenticated" } }
 * 3. Check if req.user.role is in the allowed roles array
 *    - If not: return 403 with { error: { message: "Forbidden" } }
 * 4. Call next()
 *
 * Example usage: requireRole('admin') or requireRole('admin', 'moderator')
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    // Your code here
    if (!req.user) res.status(401).send({ error: { message: "Not authenticated" } })
    if (!roles.includes(req.user.role) && req.user.role !== "admin") res.status(403).send({ error: { message: "Forbidden" } })
    next()
  };
}
