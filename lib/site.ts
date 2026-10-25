export const site = {
  name: "The 1% Club",
  description:
    "Five small-batch bottled drinks, made in our kitchen and handed straight to you. Sugarcane Splash, Coconut Milkshake, Coco Blast, Banana Breeze and Mango Milkshake. Naturally refreshing. Naturally nourishing.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsapp: process.env.NEXT_PUBLIC_ORDER_WHATSAPP ?? "",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "#",
};
