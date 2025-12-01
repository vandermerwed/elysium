import { LOCALE, SITE } from "@config";
import type { CollectionEntry } from "astro:content";

interface DatetimesProps {
  pubDatetime: string | Date;
  modDatetime: string | Date | undefined | null;
  showTime?: boolean;
}

interface EditPostProps {
  editPost?: CollectionEntry<"notes">["data"]["editPost"];
  postId?: CollectionEntry<"notes">["id"];
}

interface Props extends DatetimesProps, EditPostProps {
  size?: "sm" | "lg";
  className?: string;
  showTime?: boolean;
  showModified?: boolean;  // Add this line
  style?: "published" | "modified";
  readingTime?: string; 
  hideIcon?: boolean;
}

export default function Datetime({
  pubDatetime,
  modDatetime,
  size = "sm",
  className = "",
  showTime = true,
  showModified = false,  // Add this line
  editPost,
  postId,
  hideIcon = false,
}: Props) {
  const isSameDay = (date1: string | Date, date2: string | Date) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  return (
    <div
      className={`flex items-center opacity-80 ${!hideIcon ? "space-x-2" : ""} ${className}`.trim()}
    >
      {!hideIcon && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`${
            size === "sm" ? "scale-90" : "scale-100"
          } inline-block h-6 w-6 min-w-[1.375rem] fill-skin-base`}
          aria-hidden="true"
        >
          <path d="M7 11h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z"></path>
          <path d="M5 22h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2zM19 8l.001 12H5V8h14z"></path>
        </svg>
      )}
      <span className={`italic ${size === "sm" ? "text-sm" : "text-base"}`}>
        <FormattedDatetime pubDatetime={pubDatetime} showTime={showTime} />
        {showModified && modDatetime && modDatetime > pubDatetime && !isSameDay(pubDatetime, modDatetime) && (
          <>
            &nbsp;[Updated:&nbsp;
            <FormattedDatetime pubDatetime={modDatetime} showTime={showTime} />
            ]
          </>
        )}
        {size === "lg" && <EditPost editPost={editPost} postId={postId} />}
      </span>
    </div>
  );
}

const FormattedDatetime = ({ pubDatetime, showTime }: Partial<DatetimesProps>) => {
  const myDatetime = new Date(pubDatetime ?? "");

  const date = myDatetime.toLocaleDateString(LOCALE.langTag, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const time = myDatetime.toLocaleTimeString(LOCALE.langTag, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <time dateTime={myDatetime.toISOString()}>{date}</time>
      {showTime && (
        <>
          <span aria-hidden="true"> | </span>
          <span className="sr-only">&nbsp;at&nbsp;</span>
          <span className="text-nowrap">{time}</span>
        </>
      )}
    </>
  );
};

const EditPost = ({ editPost, postId }: EditPostProps) => {
  let editPostUrl = editPost?.url ?? SITE?.editPost?.url ?? "";
  const showEditPost = (!SITE?.editPost?.disabled && !editPost?.disabled) && editPostUrl.length > 0;
  const appendFilePath =
    editPost?.appendFilePath ?? SITE?.editPost?.appendFilePath ?? false;
  if (appendFilePath && postId) {
    editPostUrl += `/${postId}`;
  }
  const editPostText = editPost?.text ?? SITE?.editPost?.text ?? "Edit";

  return (
    showEditPost && (
      <>
        <span aria-hidden="true"> | </span>
        <a
          className="hover:opacity-75"
          href={editPostUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          {editPostText}
        </a>
      </>
    )
  );
};
