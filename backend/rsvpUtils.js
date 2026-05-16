const DUPLICATE_MESSAGE =
  "You have responded previously, contact the host to make any modification";

function normalizeName(name) {
  return String(name || "").trim().toLowerCase();
}

async function findRsvpByNormalizedName(pool, name, excludeId = null) {
  const normalized = normalizeName(name);
  if (!normalized) return null;

  const params = [normalized];
  let sql = `SELECT id, name FROM rsvps WHERE LOWER(TRIM(name)) = $1`;
  if (excludeId != null) {
    params.push(excludeId);
    sql += ` AND id <> $2`;
  }
  sql += ` LIMIT 1`;

  const result = await pool.query(sql, params);
  return result.rows[0] || null;
}

async function getTotalAttending(pool) {
  const result = await pool.query(
    `SELECT COALESCE(SUM(COALESCE(guest_count, 0) + 1), 0)::int AS total_attending
     FROM rsvps
     WHERE attending = true`
  );
  return Number(result.rows[0]?.total_attending ?? 0);
}

function validateRsvpFields({ name, attending, guest_count }) {
  if (name == null || String(name).trim() === "") {
    return { ok: false, status: 400, error: "Name is required" };
  }

  if (typeof attending !== "boolean") {
    return { ok: false, status: 400, error: "Attending is required" };
  }

  if (attending === true) {
    if (
      guest_count == null ||
      typeof guest_count !== "number" ||
      !Number.isInteger(guest_count) ||
      guest_count < 0
    ) {
      return {
        ok: false,
        status: 400,
        error: "Guest count is required when attending",
      };
    }
  }

  return { ok: true };
}

module.exports = {
  DUPLICATE_MESSAGE,
  normalizeName,
  findRsvpByNormalizedName,
  getTotalAttending,
  validateRsvpFields,
};
