import type { VercelRequest, VercelResponse } from "@vercel/node";

// Sample content for demo - in production this would read from a database
const sampleContent = [
  {
    id: "demo-jacob-esau",
    storyName: "Jacob and Esau",
    storyData: {
      source_story: "Jacob and Esau (Genesis 25 & 27)",
      protagonist: "Jacob",
      conflict_core: "Stealing the birthright and blessing through deception",
      primary_emotion: "betrayal",
      emotion_intensity: 8
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
    review: {
      overallScore: 87,
      passed: true,
      criteria: {
        hookStrength: 9,
        hookFeedback: "Excellent hook - 'tricking my brother' and 'bowl of soup' creates immediate intrigue and absurdity. The contrast is perfect clickbait.",
        emotionalEngagement: 8,
        emotionalFeedback: "Strong emotional pull - family betrayal, unfairness themes. The escalation to 'brother wants to kill me' adds drama.",
        controversyLevel: 9,
        controversyFeedback: "Perfect split potential. Some will side with Jacob's 'smart business move', others will call him manipulative. The blind father deception is polarizing.",
        relatability: 8,
        relatabilityFeedback: "Sibling rivalry, inheritance drama, favoritism - extremely relatable modern themes. Language is natural and casual.",
        pacing: 8,
        pacingFeedback: "Good escalation from soup deal to goat skin deception to death threats. Each paragraph adds new drama.",
        revealImpact: 9,
        revealFeedback: "The goat skin detail is memorable and will make viewers go 'wait, I know this story!' Strong Bible-to-Reddit translation.",
        commentBait: 9,
        commentBaitFeedback: "Clear NTA/YTA debate points. The CTA with emojis is engaging. Comments section will be a battlefield."
      },
      verdict: "VIRAL_READY",
      strengths: [
        "Hook immediately establishes absurd premise (inheritance for soup)",
        "Multiple layers of deception create escalating drama",
        "Perfect controversy balance - both sides have valid arguments"
      ],
      weaknesses: [
        "Middle section could be tighter - some exposition drags",
        "Mom's involvement could be highlighted more for extra drama",
        "Ending could be punchier - 'It's been years' feels flat"
      ],
      revisionSuggestions: [
        "Trim the hunting/farming backstory - get to the soup faster",
        "Add a line about mom being the mastermind for extra controversy",
        "End with a stronger emotional hook like 'I haven't seen my family in X years'"
      ],
      predictedEngagement: "VIRAL",
      redFlags: [],
      reviewedAt: "2026-01-09T10:35:00.000Z"
    },
    status: "approved",
    duration: 72,
    videoPath: null,
    createdAt: "2026-01-09T10:30:00.000Z"
  },
  {
    id: "demo-cain-abel",
    storyName: "Cain and Abel",
    storyData: {
      source_story: "Cain and Abel (Genesis 4)",
      protagonist: "Cain",
      conflict_core: "Jealousy over God favoring brother's offering",
      primary_emotion: "jealousy",
      emotion_intensity: 9
    },
    aitaContent: {
      post_title: "AITA for being upset that my brother's gift was accepted but mine wasn't?",
      post_body: "I (M, early 20s) have been working my absolute hardest as a farmer. Every single day I'm out in the fields, tilling soil, planting seeds, dealing with droughts and pests. It's EXHAUSTING work.\n\nMy younger brother (M, early 20s) is a shepherd. He basically just watches sheep all day. Don't get me wrong, it's work, but it's not the same level of physical labor I put in.\n\nSo here's what happened. We both decided to give offerings to show gratitude. I brought some of my crops - the fruits of my labor, literally. My brother brought some firstborn lambs from his flock.\n\nAnd guess what? His offering was accepted and praised, but mine was basically ignored. No acknowledgment, no appreciation. Nothing.\n\nI was devastated. I put SO much work into growing those crops. I don't understand what I did wrong. Was it not good enough? Was I supposed to bring something else?\n\nI've been in a really dark place since then. I can barely look at my brother without feeling this burning resentment. He keeps trying to talk to me but I just can't.\n\nMy parents think I'm overreacting and that I should just 'try again' and 'do better next time.' But they don't understand how humiliating it was.\n\nI've been having some really dark thoughts about my brother. I know it's not his fault, but I can't help feeling like everything would be better if he just... wasn't around.\n\nAITA for being angry that my hard work was overlooked while my brother was rewarded for less effort?",
      fake_comments: [
        { user: "therapy_needed_123", text: "NTA for feeling upset, but YTA for those 'dark thoughts.' Please talk to someone. This resentment will destroy you.", upvotes: 3421 },
        { user: "sibling_rivalry_expert", text: "INFO: What exactly did you bring? 'Some crops' vs 'firstborn lambs' suggests different levels of sacrifice.", upvotes: 2156 },
        { user: "oldest_child_solidarity", text: "NTA. Favoritism is real and it hurts. But please don't let it consume you.", upvotes: 1834 }
      ],
      pinned_comment: "This was the story of Cain and Abel from Genesis 4. The first murder in human history. 😱",
      cta: "🌾 if you understand Cain's frustration, or 🐑 if Abel did nothing wrong!",
      metadata: {
        biblical_source: "Genesis 4",
        characters: ["Cain", "Abel", "Adam", "Eve"],
        controversy_level: 9
      }
    },
    review: {
      overallScore: 82,
      passed: true,
      criteria: {
        hookStrength: 7,
        hookFeedback: "Hook is decent but generic. 'Gift was accepted but mine wasn't' lacks punch. Consider leading with the rejection feeling or the dark thoughts.",
        emotionalEngagement: 9,
        emotionalFeedback: "Excellent emotional depth. The jealousy, rejection, and dark thoughts progression is visceral. Readers will feel the spiral.",
        controversyLevel: 8,
        controversyFeedback: "Good split - some will sympathize with rejection feelings, others will focus on the concerning dark thoughts. The 'some crops' vs 'firstborn' detail adds nuance.",
        relatability: 9,
        relatabilityFeedback: "Workplace favoritism, sibling comparison, feeling overlooked - universally relatable themes. The farming vs shepherding translates well to modern work.",
        pacing: 7,
        pacingFeedback: "Slow build. The farming backstory takes too long before reaching the conflict. Dark thoughts reveal comes late.",
        revealImpact: 9,
        revealFeedback: "The 'first murder in human history' reveal is powerful. The foreshadowing of dark thoughts makes it land perfectly.",
        commentBait: 8,
        commentBaitFeedback: "The INFO comment about sacrifice quality is clever engagement bait. Comments will debate effort vs outcome."
      },
      verdict: "VIRAL_READY",
      strengths: [
        "Dark thoughts foreshadowing creates tension that pays off in reveal",
        "Emotional progression from hurt to resentment to darkness is compelling",
        "INFO comment prompts deeper engagement with the story details"
      ],
      weaknesses: [
        "Hook doesn't immediately grab - too generic for a scroll-stopping first line",
        "Opening paragraphs are exposition-heavy before conflict hits",
        "Could lean harder into the absurdity of the situation"
      ],
      revisionSuggestions: [
        "Rewrite hook: 'AITA for wanting my brother dead because his gift was better than mine?'",
        "Cut the farming/shepherding comparison - get to the rejection faster",
        "Move 'dark thoughts' hint earlier to create tension throughout"
      ],
      predictedEngagement: "HIGH",
      redFlags: [
        "Dark thoughts content may trigger some platform warnings - ensure reveal provides context"
      ],
      reviewedAt: "2026-01-08T14:25:00.000Z"
    },
    status: "approved",
    duration: 68,
    videoPath: null,
    createdAt: "2026-01-08T14:20:00.000Z"
  },
  {
    id: "demo-david-bathsheba",
    storyName: "David and Bathsheba",
    storyData: {
      source_story: "David and Bathsheba (2 Samuel 11-12)",
      protagonist: "David",
      conflict_core: "Adultery and murder cover-up by a king",
      primary_emotion: "betrayal",
      emotion_intensity: 10
    },
    aitaContent: {
      post_title: "AITA for having an affair with a married woman and then arranging for her husband to die in battle?",
      post_body: "Throwaway for obvious reasons. I (M50s) am in a position of significant power. Think CEO level, but bigger. I have multiple wives already, which is normal in my culture.\n\nOne evening I was on my rooftop and I saw a woman bathing. She was incredibly beautiful. I found out she was married to one of my most loyal employees - a man who has literally risked his life for me multiple times.\n\nI know I should have looked away. But I didn't. I sent for her. We slept together. She got pregnant.\n\nPanic mode. Her husband was away on a work trip (one that I sent him on). I called him back, hoping he'd go home to his wife and... you know... so everyone would think the baby was his.\n\nBut this guy is TOO loyal and TOO honorable. He refused to go home and enjoy comforts while his coworkers were still working hard. He slept outside my door instead.\n\nI tried getting him drunk. Still didn't work.\n\nSo I did something terrible. I sent him back to work with a sealed letter to his boss. The letter contained instructions to put him in the most dangerous position and then abandon him. He died.\n\nAfter the mourning period, I married his widow. Problem solved, right?\n\nExcept now I can't sleep. I feel sick constantly. Someone confronted me about it using a hypothetical story about a rich man stealing a poor man's only lamb, and I was FURIOUS at the rich man before realizing... I was the rich man.\n\nAITA? I already know the answer. I just needed to confess somewhere.",
      fake_comments: [
        { user: "absolutely_horrified", text: "YTA. This isn't even a question. You're a murderer and an adulterer. The power imbalance alone... she couldn't say no to you.", upvotes: 8934 },
        { user: "true_crime_fan", text: "This is one of the most calculated, cold-blooded things I've ever read. You didn't just cheat - you orchestrated a man's DEATH.", upvotes: 6721 },
        { user: "seeking_redemption", text: "The fact that you feel guilt means something. But feeling bad isn't enough. You need to face real consequences.", upvotes: 4523 }
      ],
      pinned_comment: "This was the story of King David and Bathsheba from 2 Samuel 11-12. One of the darkest chapters in the Bible. 👑💔",
      cta: "This one's not even close... but 👑 if power corrupts, or ⚔️ for Uriah!",
      metadata: {
        biblical_source: "2 Samuel 11-12",
        characters: ["David", "Bathsheba", "Uriah", "Nathan"],
        controversy_level: 10
      }
    },
    review: {
      overallScore: 91,
      passed: true,
      criteria: {
        hookStrength: 10,
        hookFeedback: "Perfect hook. 'Affair with married woman' + 'arranged husband's death' is maximum intrigue. Impossible to scroll past.",
        emotionalEngagement: 10,
        emotionalFeedback: "Exceptional emotional journey. Betrayal, abuse of power, murder, guilt - hits every emotional beat. The confession framing adds vulnerability.",
        controversyLevel: 7,
        controversyFeedback: "Less controversial because it's clearly YTA - the calculated murder removes debate. However, the power/consent discussion adds nuance.",
        relatability: 8,
        relatabilityFeedback: "Power abuse, workplace affairs, cover-ups - modern scandals follow this pattern. CEO framing works well.",
        pacing: 9,
        pacingFeedback: "Excellent escalation: lust → affair → pregnancy → failed cover-ups → murder → guilt. Each attempt to fix makes it worse.",
        revealImpact: 10,
        revealFeedback: "The lamb metaphor is brilliant. The 'I was the rich man' moment is a gut punch. King David reveal lands perfectly.",
        commentBait: 9,
        commentBaitFeedback: "Even though YTA is obvious, people will engage with the power dynamics and consent discussions. High comment quality expected."
      },
      verdict: "VIRAL_READY",
      strengths: [
        "Hook is absolutely perfect - maximum intrigue in minimum words",
        "The escalating failed cover-ups create compelling narrative tension",
        "Lamb metaphor revelation is a masterclass in storytelling payoff"
      ],
      weaknesses: [
        "Too clearly YTA - less controversy means less debate in comments",
        "The 'multiple wives' line might confuse modern audiences",
        "CTA feels weak compared to the story's weight"
      ],
      revisionSuggestions: [
        "Add a line exploring power dynamics to spark consent debate in comments",
        "Consider alternative CTA that prompts discussion rather than voting",
        "Possibly add a detail about Bathsheba's perspective for more controversy"
      ],
      predictedEngagement: "VIRAL",
      redFlags: [
        "Heavy content (murder, affair) - may need sensitive content flags on some platforms"
      ],
      reviewedAt: "2026-01-07T09:20:00.000Z"
    },
    status: "approved",
    duration: 85,
    videoPath: null,
    createdAt: "2026-01-07T09:15:00.000Z"
  }
];

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  // Return sample content for demo
  return res.status(200).json(sampleContent);
}
