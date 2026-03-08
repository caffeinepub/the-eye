import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const AVAILABLE_TAGS = [
  "Survival",
  "Skyblock",
  "PvP",
  "Lifesteal",
  "BedWars",
  "Factions",
  "Anarchy",
  "RPG",
  "Economy",
  "Minigames",
  "SMP",
  "Crossplay",
  "Prison",
  "Parkour",
  "Creative",
];

interface UploadedImage {
  file: File;
  previewUrl: string;
}

export default function SubmitServerTab() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const [serverName, setServerName] = useState("");
  const [serverIp, setServerIp] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }, []);

  const handleImageUpload = useCallback((files: FileList | null) => {
    if (!files) return;
    const newImages: UploadedImage[] = [];
    for (const file of Array.from(files)) {
      if (file.type.startsWith("image/")) {
        newImages.push({ file, previewUrl: URL.createObjectURL(file) });
      }
    }
    setImages((prev) => [...prev, ...newImages].slice(0, 8));
  }, []);

  const removeImage = useCallback((idx: number) => {
    setImages((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[idx].previewUrl);
      next.splice(idx, 1);
      return next;
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      handleImageUpload(e.dataTransfer.files);
    },
    [handleImageUpload],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isAuthenticated) return;
      if (images.length < 4) {
        toast.error("Please upload at least 4 images");
        return;
      }
      if (!serverName.trim() || !serverIp.trim()) {
        toast.error("Server name and IP are required");
        return;
      }

      setIsSubmitting(true);
      try {
        // Simulate submission — backend is read-only
        await new Promise((resolve) => setTimeout(resolve, 1200));
        toast.success("Server submitted!", {
          description: `${serverName} has been submitted for review.`,
        });
        setServerName("");
        setServerIp("");
        setDescription("");
        setSelectedTags([]);
        setImages([]);
      } catch {
        toast.error("Submission failed. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [isAuthenticated, images.length, serverName, serverIp],
  );

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: "oklch(0.52 0.21 25 / 0.12)",
            border: "1px solid oklch(0.52 0.21 25 / 0.3)",
            boxShadow: "0 0 20px oklch(0.52 0.21 25 / 0.15)",
          }}
        >
          <Upload
            className="w-7 h-7"
            style={{ color: "oklch(0.68 0.18 28)" }}
          />
        </div>
        <div className="text-center space-y-2">
          <h3
            className="eye-section-glow text-lg font-bold uppercase tracking-widest"
            style={{ color: "#ff6b6b" }}
          >
            Sign In Required
          </h3>
          <p
            className="text-sm max-w-xs"
            style={{ color: "oklch(0.5 0.04 25)" }}
          >
            Please sign in to submit your server to THE EYE directory.
          </p>
        </div>
        <button
          type="button"
          data-ocid="auth.sign_in.button"
          onClick={login}
          disabled={isLoggingIn}
          className="px-8 py-3 rounded-lg font-bold text-sm tracking-wide text-white transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.52 0.21 25), oklch(0.42 0.18 23))",
            boxShadow: "0 0 20px oklch(0.52 0.21 25 / 0.35)",
          }}
        >
          {isLoggingIn ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in...
            </span>
          ) : (
            "Sign In to Submit"
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h2
          className="eye-section-glow text-xl font-black uppercase tracking-[0.15em]"
          style={{ color: "#ff6b6b" }}
        >
          📤 Submit Your Server
        </h2>
        <p className="text-sm" style={{ color: "oklch(0.5 0.04 25)" }}>
          Share your Minecraft server with the community
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        data-ocid="submit_server.panel"
      >
        {/* Server Name */}
        <div className="space-y-2">
          <Label
            htmlFor="server-name"
            className="text-sm font-semibold"
            style={{ color: "oklch(0.78 0.06 25)" }}
          >
            Server Name *
          </Label>
          <Input
            id="server-name"
            data-ocid="submit_server.name.input"
            type="text"
            placeholder="e.g. AwesomeCraft"
            value={serverName}
            onChange={(e) => setServerName(e.target.value)}
            required
            className="h-11"
            style={{
              background: "oklch(0.13 0.015 20)",
              borderColor: "oklch(0.25 0.04 25)",
              color: "oklch(0.92 0.01 90)",
            }}
          />
        </div>

        {/* Server IP */}
        <div className="space-y-2">
          <Label
            htmlFor="server-ip"
            className="text-sm font-semibold"
            style={{ color: "oklch(0.78 0.06 25)" }}
          >
            Server IP *
          </Label>
          <Input
            id="server-ip"
            data-ocid="submit_server.ip.input"
            type="text"
            placeholder="e.g. play.awesomecraft.net"
            value={serverIp}
            onChange={(e) => setServerIp(e.target.value)}
            required
            className="h-11 font-mono"
            style={{
              background: "oklch(0.13 0.015 20)",
              borderColor: "oklch(0.25 0.04 25)",
              color: "oklch(0.72 0.12 28)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label
            htmlFor="server-desc"
            className="text-sm font-semibold"
            style={{ color: "oklch(0.78 0.06 25)" }}
          >
            Description
          </Label>
          <Textarea
            id="server-desc"
            data-ocid="submit_server.description.textarea"
            placeholder="Describe your server, its features, community, and what makes it unique..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="resize-none"
            style={{
              background: "oklch(0.13 0.015 20)",
              borderColor: "oklch(0.25 0.04 25)",
              color: "oklch(0.88 0.01 90)",
            }}
          />
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <Label
            className="text-sm font-semibold"
            style={{ color: "oklch(0.78 0.06 25)" }}
          >
            Tags (select all that apply)
          </Label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TAGS.map((tag) => {
              const checked = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background: checked
                      ? "oklch(0.52 0.21 25 / 0.3)"
                      : "oklch(0.16 0.02 22)",
                    border: checked
                      ? "1px solid oklch(0.52 0.21 25 / 0.7)"
                      : "1px solid oklch(0.25 0.035 25)",
                    color: checked ? "#fff" : "oklch(0.55 0.05 25)",
                    boxShadow: checked
                      ? "0 0 8px oklch(0.52 0.21 25 / 0.3)"
                      : "none",
                  }}
                >
                  <Checkbox
                    checked={checked}
                    className="w-3 h-3 pointer-events-none"
                    style={{
                      borderColor: checked
                        ? "oklch(0.52 0.21 25)"
                        : "oklch(0.35 0.05 25)",
                    }}
                  />
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-3">
          <Label
            className="text-sm font-semibold"
            style={{ color: "oklch(0.78 0.06 25)" }}
          >
            Server Images * (minimum 4)
          </Label>

          {/* Drop zone — use label to wrap the file input for semantic HTML */}
          <label
            htmlFor="server-images"
            data-ocid="submit_server.dropzone"
            className="rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-all block"
            style={{
              borderColor: "oklch(0.32 0.06 25)",
              background: "oklch(0.11 0.012 20)",
            }}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <ImagePlus
              className="w-8 h-8 mx-auto mb-3"
              style={{ color: "oklch(0.45 0.1 25)" }}
            />
            <p
              className="text-sm font-semibold"
              style={{ color: "oklch(0.65 0.08 25)" }}
            >
              Drop images here or click to upload
            </p>
            <p className="text-xs mt-1" style={{ color: "oklch(0.4 0.04 25)" }}>
              PNG, JPG, GIF up to 10MB each · {images.length}/8 uploaded
              {images.length < 4 && (
                <span style={{ color: "oklch(0.55 0.18 27)" }}>
                  {" "}
                  · Need {4 - images.length} more
                </span>
              )}
            </p>
            <input
              ref={fileInputRef}
              id="server-images"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              data-ocid="submit_server.upload_button"
              onChange={(e) => handleImageUpload(e.target.files)}
            />
          </label>

          {/* Image previews */}
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, i) => (
                <div
                  key={img.previewUrl}
                  className="relative rounded-lg overflow-hidden aspect-video"
                  style={{ border: "1px solid oklch(0.25 0.04 25)" }}
                >
                  <img
                    src={img.previewUrl}
                    alt={`Upload ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "oklch(0 0 0 / 0.7)", color: "#fff" }}
                    aria-label="Remove image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          data-ocid="submit_server.submit.button"
          disabled={isSubmitting || images.length < 4}
          className="w-full h-12 font-bold text-sm tracking-wide text-white rounded-lg"
          style={{
            background:
              isSubmitting || images.length < 4
                ? "oklch(0.25 0.04 25)"
                : "linear-gradient(135deg, oklch(0.52 0.21 25), oklch(0.42 0.18 23))",
            boxShadow:
              isSubmitting || images.length < 4
                ? "none"
                : "0 0 20px oklch(0.52 0.21 25 / 0.35)",
            border: "none",
          }}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </span>
          ) : (
            "Submit Server"
          )}
        </Button>
      </form>
    </div>
  );
}
