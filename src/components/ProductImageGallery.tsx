import { useEffect, useMemo, useRef, useState } from "react";

type GalleryImage = {
  src: string;
  alt: string;
  thumbnailAlt?: string;
  width?: number;
  height?: number;
};

type ProductImageGalleryProps = {
  images: GalleryImage[];
  className?: string;
};

export function ProductImageGallery({ images, className = "" }: ProductImageGalleryProps) {
  const safeImages = useMemo(() => images.filter((img) => img?.src), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [fadeToken, setFadeToken] = useState(0);
  const [naturalRatios, setNaturalRatios] = useState<Record<string, { width: number; height: number }>>({});
  const clearPreviousTimeoutRef = useRef<number | null>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!safeImages.length) {
      return;
    }
    safeImages.forEach((img) => {
      const preload = new Image();
      preload.decoding = "async";
      preload.onload = () => {
        if (!preload.naturalWidth || !preload.naturalHeight) {
          return;
        }
        setNaturalRatios((prev) => {
          const existing = prev[img.src];
          if (existing?.width === preload.naturalWidth && existing?.height === preload.naturalHeight) {
            return prev;
          }
          return {
            ...prev,
            [img.src]: {
              width: preload.naturalWidth,
              height: preload.naturalHeight,
            },
          };
        });
      };
      preload.src = img.src;
    });
  }, [safeImages]);

  useEffect(() => {
    return () => {
      if (clearPreviousTimeoutRef.current !== null) {
        window.clearTimeout(clearPreviousTimeoutRef.current);
      }
    };
  }, []);

  if (!safeImages.length) {
    return null;
  }

  const selectImage = (nextIndex: number) => {
    if (nextIndex === activeIndex || nextIndex < 0 || nextIndex >= safeImages.length) {
      return;
    }

    if (clearPreviousTimeoutRef.current !== null) {
      window.clearTimeout(clearPreviousTimeoutRef.current);
    }

    setPreviousIndex(activeIndex);
    setActiveIndex(nextIndex);
    setFadeToken((token) => token + 1);

    clearPreviousTimeoutRef.current = window.setTimeout(() => {
      setPreviousIndex(null);
      clearPreviousTimeoutRef.current = null;
    }, 320);
  };

  const onThumbKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const total = safeImages.length;
    let next = index;

    if (event.key === "ArrowRight") {
      next = (index + 1) % total;
    }
    if (event.key === "ArrowLeft") {
      next = (index - 1 + total) % total;
    }
    if (event.key === "Home") {
      next = 0;
    }
    if (event.key === "End") {
      next = total - 1;
    }

    selectImage(next);
    thumbRefs.current[next]?.focus();
  };

  const activeImage = safeImages[activeIndex];
  const previousImage = previousIndex !== null ? safeImages[previousIndex] : null;
  const activeNatural = naturalRatios[activeImage.src];
  const activeWidth = activeNatural?.width ?? activeImage.width ?? 2;
  const activeHeight = activeNatural?.height ?? activeImage.height ?? 3;

  return (
    <div className={className}>
      <div
        className="relative mx-auto w-full max-w-[384px] lg:max-w-[500px]"
        style={{ aspectRatio: `${activeWidth} / ${activeHeight}` }}
        aria-live="polite"
        aria-atomic="true"
      >
        {previousImage ? (
          <img
            key={`previous-${fadeToken}-${previousIndex}`}
            src={previousImage.src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-contain"
            width={previousImage.width ?? 384}
            height={previousImage.height ?? 576}
            loading="eager"
            decoding="async"
            style={{
              animation: "galleryFadeOut 320ms ease forwards",
            }}
          />
        ) : null}

        <img
          key={`active-${fadeToken}-${activeIndex}`}
          src={activeImage.src}
          alt={activeImage.alt}
          className="absolute inset-0 h-full w-full object-contain"
          width={activeImage.width ?? 384}
          height={activeImage.height ?? 576}
          loading="eager"
          decoding="async"
          style={{
            animation: "galleryFadeIn 320ms ease forwards",
          }}
        />
      </div>

      <p className="sr-only" aria-live="polite">
        Selected image: {activeImage.alt}
      </p>

      <div
        className="hide-scrollbar mx-auto mt-4 flex w-full max-w-[430px] justify-center overflow-x-auto px-2 lg:max-w-[520px]"
        role="radiogroup"
        aria-label="Product image thumbnails"
      >
        <div className="flex items-center gap-3 px-2 py-1.5 md:gap-4 lg:gap-5">
          {safeImages.map((image, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={`${image.src}-${index}`}
                ref={(element) => {
                  thumbRefs.current[index] = element;
                }}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={image.thumbnailAlt ?? `Preview ${index + 1}: ${image.alt}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => selectImage(index)}
                onKeyDown={(event) => onThumbKeyDown(event, index)}
                className={`group relative shrink-0 cursor-pointer overflow-hidden rounded-full transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  selected ? "scale-105" : "scale-100 hover:scale-[1.03]"
                }`}
                style={{
                  width: "clamp(40px, 11vw, 58px)",
                  height: "clamp(40px, 11vw, 58px)",
                  border: selected
                    ? "1.5px solid var(--gold-deep)"
                    : "1px solid color-mix(in oklab, white 76%, var(--ivory) 24%)",
                  boxShadow: selected
                    ? "0 10px 28px rgba(26, 20, 10, 0.22)"
                    : "0 6px 16px rgba(26, 20, 10, 0.15)",
                }}
              >
                <img
                  src={image.src}
                  alt={image.thumbnailAlt ?? image.alt}
                  className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                  loading="eager"
                  decoding="async"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
