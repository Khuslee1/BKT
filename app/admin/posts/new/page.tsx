import Link from "next/link";
import PostForm from "../_components/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/posts"
          className="font-condensed text-xs tracking-widest uppercase text-stone hover:text-gold transition-colors block mb-3"
        >
          ← Back to Posts
        </Link>
        <p className="section-eyebrow mb-2">Create</p>
        <h1 className="font-display text-3xl text-parchment">
          New <em className="text-gold">Post</em>
        </h1>
      </div>

      <PostForm />
    </div>
  );
}
