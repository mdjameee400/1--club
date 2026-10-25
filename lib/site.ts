const clean = (v: string | undefined) => (v ?? "").trim();

const messenger = clean(process.env.NEXT_PUBLIC_MESSENGER_USERNAME).replace(
  /^(https?:\/\/)?(www\.)?(m\.me|facebook\.com)\//,
  "",
).replace(/\/$/, "");

const facebook = clean(process.env.NEXT_PUBLIC_FACEBOOK_URL);

export const site = {
  name: "The 1% Club",
  description:
    "Five small-batch bottled drinks, made in our kitchen and handed straight to you. Sugarcane Splash, Coconut Milkshake, Coco Blast, Banana Breeze and Mango Milkshake. Naturally refreshing. Naturally nourishing.",
  url: clean(process.env.NEXT_PUBLIC_SITE_URL) || "https://onepercentclub-delta.vercel.app",
  instagram:
    clean(process.env.NEXT_PUBLIC_INSTAGRAM_URL) ||
    "https://www.instagram.com/theonepercentclubbb",
  /** Empty string = not configured (the link is simply hidden). */
  facebook,
  /** Messenger username of the Facebook page, e.g. "theonepercentclub". */
  messenger,
  /** Where "order on Messenger" sends people. Empty if nothing is configured. */
  chatUrl: messenger ? `https://m.me/${messenger}` : facebook,
};
