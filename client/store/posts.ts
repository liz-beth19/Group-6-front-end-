export type Post = {
  id: string;
  title: string;
  body: string;
  createdAt: string; // ISO
  author: string;
};

const POSTS_KEY = "gg_posts";

function save(posts: Post[]) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

function seed(): Post[] {
  const now = new Date();
  const base: Post[] = [
    {
      id: `p_${now.getTime()}_1`,
      title: "Welcome to GradGate",
      body: "We’re excited to have you! Explore learnerships, internships and build your profile to get tailored matches.",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      author: "admin",
    },
    {
      id: `p_${now.getTime()}_2`,
      title: "New Opportunities Weekly",
      body: "We add fresh roles every week. Check Opportunities and save jobs you like to track them easily.",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      author: "admin",
    },
    {
      id: `p_${now.getTime()}_3`,
      title: "Update Your Profile",
      body: "Keep your skills and interests updated to improve your matching and recommendations.",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 18).toISOString(),
      author: "admin",
    },
  ];
  save(base);
  return base;
}

export function getPosts(): Post[] {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw) as Post[];
    if (!Array.isArray(parsed) || parsed.length === 0) return seed();
    return parsed.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  } catch {
    return seed();
  }
}

export function addPost(input: { title: string; body: string; author: string }): Post {
  const posts = getPosts();
  const p: Post = {
    id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title: input.title.trim(),
    body: input.body.trim(),
    createdAt: new Date().toISOString(),
    author: input.author,
  };
  const next = [p, ...posts];
  save(next);
  return p;
}

export function removePost(id: string) {
  const posts = getPosts();
  const next = posts.filter((p) => p.id !== id);
  save(next);
  return next;
}

export function clearPosts() {
  localStorage.removeItem(POSTS_KEY);
}
