import type { VercelRequest, VercelResponse } from "@vercel/node";

// Sample stories data for demo
const stories = [
  { name: "Jacob and Esau", completed: false, protagonist: "Jacob", hook: "AITA for stealing my brother's inheritance for soup?", emotion: "betrayal" },
  { name: "Cain and Abel", completed: false, protagonist: "Cain", hook: "AITA for being jealous of my brother's offering?", emotion: "jealousy" },
  { name: "David and Bathsheba", completed: false, protagonist: "David", hook: "AITA for sleeping with a married woman and having her husband killed?", emotion: "betrayal" },
  { name: "Joseph and his Brothers", completed: false, protagonist: "Joseph", hook: "AITA for sharing my dreams where my family bowed to me?", emotion: "conflict" },
  { name: "Abraham and Hagar", completed: false, protagonist: "Abraham", hook: "AITA for sending my concubine and son into the desert?", emotion: "conflict" },
  { name: "Samson and Delilah", completed: false, protagonist: "Samson", hook: "AITA for telling my secret to my girlfriend?", emotion: "betrayal" },
  { name: "Lot and his Daughters", completed: false, protagonist: "Lot", hook: "AITA for offering my daughters to an angry mob?", emotion: "conflict" },
  { name: "Rachel and Leah", completed: false, protagonist: "Rachel", hook: "AITA for being jealous of my sister's children?", emotion: "jealousy" },
  { name: "Moses and Pharaoh", completed: false, protagonist: "Moses", hook: "AITA for sending plagues to an entire nation?", emotion: "strength" },
  { name: "Jonah and Nineveh", completed: false, protagonist: "Jonah", hook: "AITA for being angry that God forgave a city?", emotion: "conflict" }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  return res.status(200).json(stories);
}
