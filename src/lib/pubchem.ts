/** PubChem PUG REST helpers (server-side). */

export type PubChemCompound = {
  cid: string;
  smiles?: string;
  inchi?: string;
  molecularFormula?: string;
  title?: string;
  imageUrl: string;
};

function casToDigits(cas: string): string | null {
  const cleaned = cas.replace(/\s/g, "");
  const m = /^(\d{2,7})-(\d{2})-(\d)$/.exec(cleaned);
  if (!m) return null;
  return `${m[1]}${m[2]}${m[3]}`;
}

export async function fetchPubChemByCas(cas: string): Promise<PubChemCompound | null> {
  const digits = casToDigits(cas);
  if (!digits) return null;

  const listUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/xref/RN/${digits}/cids/JSON`;
  const listRes = await fetch(listUrl, { next: { revalidate: 86400 } });
  if (!listRes.ok) return null;
  const listJson = (await listRes.json()) as { IdentifierList?: { CID?: number[] } };
  const cid = listJson.IdentifierList?.CID?.[0];
  if (!cid) return null;

  const propUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula,CanonicalSMILES,InChI,IUPACName/JSON`;
  const propRes = await fetch(propUrl, { next: { revalidate: 86400 } });
  const props = propRes.ok ? ((await propRes.json()) as { PropertyTable?: { Properties?: Record<string, string>[] } }) : {};
  const row = props.PropertyTable?.Properties?.[0] ?? {};

  return {
    cid: String(cid),
    smiles: row.CanonicalSMILES,
    inchi: row.InChI,
    molecularFormula: row.MolecularFormula,
    title: row.IUPACName,
    imageUrl: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?record_type=2d&image_size=400x400`,
  };
}
