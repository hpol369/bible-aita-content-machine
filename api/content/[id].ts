import type { VercelRequest, VercelResponse } from "@vercel/node";

// Sample content lookup
const contentMap: Record<string, object> = {
  "demo-jacob-esau": {
    id: "demo-jacob-esau",
    storyName: "Jacob and Esau",
    storyData: {
      source_story: "Jacob and Esau (Genesis 25 & 27)",
      protagonist: "Jacob",
      conflict_core: "Stealing the birthright and blessing through deception",
      primary_emotion: "betrayal",
      emotion_intensity: 8,
      theological_context: "The birthright (bechorah) entitled one to a double portion of inheritance and spiritual leadership of the family.",
      character_profiles: {
        Jacob: "Clever, calculating, 'tent dweller', mother's favorite",
        Esau: "Impulsive, hunter, lives for the moment, father's favorite",
        Isaac: "Old, blind, determined to follow tradition",
        Rebekah: "Protective mother, favored Jacob, helped with the deception"
      }
    },
    aitaContent: {
      post_title: "AITA for tricking my brother into selling me his inheritance for a bowl of soup?",
      post_body: "Okay, this might sound bad, but hear me out. So my brother (M25) and I are twins, but he came out first so technically he gets everything when our dad dies - double inheritance, family leadership, the whole deal. Meanwhile I get... nothing? How is that fair?\n\nAnyway, my brother is kind of impulsive and not the sharpest tool in the shed. He's always out hunting while I stay home and actually help around the house. One day he comes back from a hunting trip absolutely STARVING and I happened to be making some lentil stew.\n\nHe literally said he was 'about to die' from hunger (dramatic much?) and begged me for some food. So I saw an opportunity and told him I'd give him the stew if he sold me his birthright. And you know what? HE AGREED. On the spot. For soup.\n\nNow everyone's acting like I'm the bad guy?? He's a grown man who made his own choice. It's not my fault he values food more than his future. My mom thinks I did the right thing because honestly, my brother would probably just waste the inheritance anyway.\n\nBut wait, it gets worse. Years later, when our dad was old and blind, my mom and I may have... slightly deceived him into giving me the blessing that was meant for my brother. I wore goat skin on my arms to feel hairy like him. Dad fell for it.\n\nNow my brother wants to literally kill me and I had to flee the country. My mom says I should stay away until he calms down. It's been years.\n\nAITA for being smart enough to secure my future when my brother clearly didn't value his?",
      fake_comments: [
        { user: "judgment_judy_99", text: "NTA. Your brother is a grown adult who made a choice. Play stupid games, win stupid prizes.", upvotes: 2341 },
        { user: "family_first_always", text: "YTA. Deceiving your blind father is absolutely disgusting behavior. The goat skin thing is psychotic.", upvotes: 1892 },
        { user: "red_flags_everywhere", text: "ESH. Your brother for being impulsive, you for the manipulation, your mom for helping you scheme. This family needs therapy.", upvotes: 956 }
      ],
      pinned_comment: "This was the story of Jacob and Esau from Genesis 25-27. Did you figure it out? 🤯",
      cta: "Drop a 🐍 if Jacob was right, or a 🍲 if Esau deserved better!",
      metadata: {
        biblical_source: "Genesis 25-27",
        characters: ["Jacob", "Esau", "Isaac", "Rebekah"],
        controversy_level: 8
      }
    },
    duration: 72,
    createdAt: new Date().toISOString()
  }
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { id } = req.query;
  const contentId = Array.isArray(id) ? id[0] : id;

  if (contentId && contentMap[contentId]) {
    return res.status(200).json(contentMap[contentId]);
  }

  return res.status(404).json({ error: "Content not found" });
}
