"use client";

import { useRef, useState } from "react";

export interface UploadedImage {
  id?: string;
  url: string;
  alt?: string;
}

export default function ImageUploader({
  images,
  onUploaded,
  onRemove,
  label = "Images",
}: {
  images: UploadedImage[];
  onUploaded: (img: UploadedImage) => void;
  onRemove: (img: UploadedImage, index: number) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        onUploaded({ url });
      } else {
        const body = await res.json().catch(() => ({}));
        setUploadError(body.error ?? "Upload failed");
      }
    } catch {
      setUploadError("Network error during upload");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <p
        className="block font-condensed text-[11px] tracking-widest uppercase mb-3"
        style={{ color: "var(--gold)" }}
      >
        {label}
      </p>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {images.map((img, i) => (
            <div key={`${img.url}-${i}`} className="relative group aspect-video overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/blob-image?url=${encodeURIComponent(img.url)}`}
                alt={img.alt ?? ""}
                className="w-full h-full object-cover"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => onRemove(img, i)}
                  className="font-condensed text-[10px] tracking-widest uppercase px-3 py-1.5 border border-red-400 text-red-400 bg-black/60 hover:bg-red-400 hover:text-white transition-colors"
                >
                  Remove
                </button>
              </div>
              {/* Image index badge */}
              <div
                className="absolute top-1.5 left-1.5 w-5 h-5 flex items-center justify-center font-condensed text-[10px]"
                style={{ background: "var(--gold)", color: "var(--black)" }}
              >
                {i + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div
          className="flex items-center justify-center h-24 mb-4 font-condensed text-xs tracking-widest uppercase"
          style={{
            border: "1px dashed rgba(201,144,42,0.3)",
            color: "var(--stone)",
          }}
        >
          No images yet
        </div>
      )}

      {/* Upload trigger */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFile}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="font-condensed text-[10px] tracking-widest uppercase px-4 py-2 border transition-all duration-200 disabled:opacity-40"
        style={{
          borderColor: "rgba(201,144,42,0.4)",
          color: "var(--gold)",
        }}
        onMouseEnter={(e) => {
          if (!uploading) {
            (e.currentTarget as HTMLElement).style.background = "rgba(201,144,42,0.08)";
          }
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
      >
        {uploading ? "Uploading…" : "+ Upload Image"}
      </button>

      {uploadError && (
        <p className="text-red-400 text-xs mt-2 font-condensed">{uploadError}</p>
      )}
    </div>
  );
}
