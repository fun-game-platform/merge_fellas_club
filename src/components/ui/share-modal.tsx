import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaWeibo,
  FaWeixin,
  FaQq,
  FaLink,
  FaTimes,
} from "react-icons/fa";
import { Button } from "./button";
import { toast } from "@/hooks/use-toast";

interface ShareModalProps {
  title: string;
  url: string;
  description?: string;
  image?: string;
  trigger?: React.ReactNode;
}

interface ShareLink {
  name: string;
  icon: React.ReactNode;
  url?: string;
  action?: () => void;
}

export function ShareModal({
  title,
  url,
  description,
  image,
  trigger,
}: ShareModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const shareLinks: ShareLink[] = [
    {
      name: "Twitter",
      icon: <FaTwitter className="text-[#1DA1F2] text-xl" />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title)}`,
    },
    {
      name: "Facebook",
      icon: <FaFacebook className="text-[#1877F2] text-xl" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin className="text-[#0A66C2] text-xl" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(
      () => {
        toast({
          title: "Copy successfully",
          description: "Link has been copied to clipboard",
        });
      },
      (err) => {
        toast({
          title: "Copy failed",
          description: "Failed to copy link, please copy manually",
          variant: "destructive",
        });
        console.error("Failed to copy: ", err);
      }
    );
  };

  const handleSocialLinkClick = (e: React.MouseEvent, socialUrl: string) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(socialUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Share</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share to Social Media</DialogTitle>
          <DialogDescription>Choose a platform to share this content</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 py-4">
          {shareLinks.map((item) => (
            <div key={item.name} className="flex flex-col items-center">
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center hover:opacity-80 transition"
                  onClick={(e) => item.url && handleSocialLinkClick(e, item.url)}
                >
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-2">
                    {item.icon}
                  </div>
                  <span className="text-sm">{item.name}</span>
                </a>
              ) : (
                <button
                  className="flex flex-col items-center hover:opacity-80 transition"
                  onClick={() => item.action && item.action()}
                >
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-2">
                    {item.icon}
                  </div>
                  <span className="text-sm">{item.name}</span>
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <div className="flex items-center border rounded-md p-2">
              <input
                className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-300"
                value={url}
                readOnly
              />
            </div>
          </div>
          <Button type="button" size="sm" onClick={copyToClipboard}>
            <FaLink className="mr-2" />
            Copy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
