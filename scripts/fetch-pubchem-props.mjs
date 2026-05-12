#!/usr/bin/env node
/**
 * Fetch compound properties from PubChem PUG REST for seeding / verification.
 * Docs: https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest
 *
 * Usage: node scripts/fetch-pubchem-props.mjs 1983 6344 14798
 */
const cids = process.argv.slice(2).map((x) => x.trim()).filter(Boolean);
if (!cids.length) {
  console.error("Usage: node scripts/fetch-pubchem-props.mjs <cid> [<cid> ...]");
  process.exit(1);
}

async function fetchOne(cid) {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula,IUPACName,Title/JSON`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${cid}: ${res.status}`);
  const json = await res.json();
  const props = json?.PropertyTable?.Properties?.[0];
  return { cid, ...props };
}

(async () => {
  for (const cid of cids) {
    try {
      const row = await fetchOne(cid);
      console.log(JSON.stringify(row, null, 2));
    } catch (e) {
      console.error(String(e.message || e));
      process.exitCode = 1;
    }
  }
})();
