/**
 * TODO: Handle 404 errors
 *
 * Return 404 with { error: { message: "Route not found" } }
 */
export function notFound(req, res) {
  // Your code here
  if (req.status === 404) res.status(404).send({ error: { message: "Route not found" } })
}
