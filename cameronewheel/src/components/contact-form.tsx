import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/lib/site-data";

export type ContactIntent = "general" | "sponsorship";

export function ContactForm({
  intent,
  compact = false,
}: {
  intent: ContactIntent;
  compact?: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const subject =
    intent === "sponsorship"
      ? `Sponsorship — ${company || name || site.name}`
      : `Contact — ${name || site.name}`;

  const draft = useMemo(() => {
    const lines = [
      `To: ${site.instagramHandle}`,
      `From: ${name || "[name]"} <${email || "[email]"}>`,
    ];
    if (intent === "sponsorship") {
      lines.push(`Company: ${company || "[company]"}`);
    }
    lines.push("", message || "[message]");
    return lines.join("\n");
  }, [name, email, company, message, intent]);

  const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draft)}`;

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        void copyDraft();
      }}
    >
      <div className={compact ? "grid gap-4 sm:grid-cols-2" : "contents"}>
        <label className="grid gap-1.5">
          <Label>Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </label>
        <label className="grid gap-1.5">
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>
      </div>
      {intent === "sponsorship" ? (
        <label className="grid gap-1.5">
          <Label>Company</Label>
          <Input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            autoComplete="organization"
          />
        </label>
      ) : null}
      <label className="grid gap-1.5">
        <Label>Message</Label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className={compact ? "min-h-24" : undefined}
        />
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit">{copied ? "Copied" : "Copy note"}</Button>
        <Button asChild variant="outline">
          <a href={mailto}>Open email</a>
        </Button>
        {!compact ? (
          <Button asChild variant="outline">
            <a href="/go/instagram" rel="noreferrer">
              Instagram DMs
            </a>
          </Button>
        ) : null}
      </div>
      {intent === "general" && compact ? (
        <p className="text-sm text-muted">
          Brands: use{" "}
          <Link to="/sponsors" className="underline hover:text-fg">
            sponsorship
          </Link>
          .
        </p>
      ) : null}
      {!compact ? (
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-surface p-4 text-xs text-muted">
          {draft}
        </pre>
      ) : null}
    </form>
  );
}
