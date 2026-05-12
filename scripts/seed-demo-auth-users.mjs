/**
 * Creates or updates demo Auth users + public.profiles in your Supabase project.
 * Requires SUPABASE_SERVICE_ROLE_KEY (server-only; never commit or expose to the client).
 *
 * Keep emails/password in sync with src/lib/demo-auth.ts and docs/DEMO_ACCESS.md.
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";
import { dirname, join, resolve } from "path";

const PASSWORD = "DemoBip2026!";

/** @type {{ email: string; role: string; full_name: string }[]} */
const DEMO_USERS = [
  {
    email: "admin@demo.bip-mp.local",
    role: "platform_admin",
    full_name: "Demo Admin",
  },
  {
    email: "vendor@demo.bip-mp.local",
    role: "vendor_staff",
    full_name: "Demo Vendor",
  },
  {
    email: "buyer@demo.bip-mp.local",
    role: "buyer_user",
    full_name: "Demo Buyer",
  },
];

/** @param {string} filePath */
function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const text = readFileSync(filePath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq <= 0) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

/** Directory that contains this script’s repo (bip-mp), or null. */
function findBipMpRoot() {
  let d = resolve(process.cwd());
  for (let i = 0; i < 14; i++) {
    if (existsSync(join(d, "scripts", "seed-demo-auth-users.mjs"))) return d;
    const next = dirname(d);
    if (next === d) break;
    d = next;
  }
  return null;
}

const bipMpRoot = findBipMpRoot();
const projectRoot = bipMpRoot || process.cwd();
// `.env` first, then `.env.local` overrides (same as Next.js).
loadEnvFile(join(projectRoot, ".env"));
loadEnvFile(join(projectRoot, ".env.local"));

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!url || !serviceKey) {
  const envPath = join(projectRoot, ".env");
  const envLocalPath = join(projectRoot, ".env.local");
  console.error(
    "Missing Supabase env vars for the seed script.\n" +
      "Required in .env.local (or .env) next to bip-mp’s package.json:\n" +
      "  • NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL)\n" +
      "  • SUPABASE_SERVICE_ROLE_KEY — from Supabase → Settings → API → service_role (secret)\n" +
      "Never commit the service role key.\n",
  );
  console.error("Diagnostics:");
  console.error(`  process.cwd(): ${process.cwd()}`);
  console.error(
    `  project root (where env files were read): ${projectRoot}`,
  );
  console.error(`  ${envPath} exists: ${existsSync(envPath)}`);
  console.error(`  ${envLocalPath} exists: ${existsSync(envLocalPath)}`);
  console.error(`  URL set: ${Boolean(url)}`);
  console.error(`  SUPABASE_SERVICE_ROLE_KEY set: ${Boolean(serviceKey)}`);
  if (!bipMpRoot) {
    console.error(
      "\nThis folder is not inside the bip-mp repo (no scripts/seed-demo-auth-users.mjs above cwd).",
    );
    console.error(
      "  Fix: cd into your bip-mp clone, then: npm run seed:demo-users",
    );
  }
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} client
 * @param {string} email
 */
async function findUserByEmail(client, email) {
  const want = email.toLowerCase();
  let page = 1;
  const perPage = 200;
  for (let i = 0; i < 50; i++) {
    const { data, error } = await client.auth.admin.listUsers({
      page,
      perPage,
    });
    if (error) throw error;
    const u = data.users.find((x) => (x.email || "").toLowerCase() === want);
    if (u) return u;
    if (data.users.length < perPage) return null;
    page += 1;
  }
  return null;
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} client
 * @param {{ email: string; role: string; full_name: string }} row
 */
async function ensureDemoUser(client, row) {
  const existing = await findUserByEmail(client, row.email);
  let id;

  if (existing) {
    const { data, error } = await client.auth.admin.updateUserById(
      existing.id,
      {
        password: PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: row.full_name },
      },
    );
    if (error) throw error;
    id = data.user.id;
    console.log("Updated Auth user:", row.email);
  } else {
    const { data, error } = await client.auth.admin.createUser({
      email: row.email,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: row.full_name },
    });
    if (error) throw error;
    id = data.user.id;
    console.log("Created Auth user:", row.email);
  }

  const { error: pErr } = await client.from("profiles").upsert(
    {
      id,
      email: row.email,
      full_name: row.full_name,
      role: row.role,
    },
    { onConflict: "id" },
  );
  if (pErr) {
    console.error("profiles upsert failed for", row.email, pErr.message);
    if (pErr.code === "PGRST205" || /schema cache/i.test(String(pErr.message))) {
      console.error(`
PostgREST cannot see public.profiles — the table is missing or migrations were never applied to this project.

Fix:
  1. Supabase Dashboard → SQL Editor → paste and run the file:
     supabase/migrations/20250512000001_initial_schema.sql
  2. Run this seed again (it will reuse/update the Auth users you already created).
`);
    }
    throw pErr;
  }
  console.log("Upserted profile:", row.email, `(${row.role})`);
}

async function main() {
  console.log("Seeding demo Auth users + profiles…");
  for (const row of DEMO_USERS) {
    await ensureDemoUser(supabase, row);
  }
  console.log("Done. Sign in at /en/auth/login with the demo emails and password.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
