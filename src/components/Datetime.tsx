import { LOCALE } from "@config";

export interface Props {
  datetime: string | Date;
  size?: "sm" | "lg";
  className?: string;
  showTime?: boolean;
  style?: "published" | "modified";
}

export default function Datetime({ datetime, size = "sm", className, showTime = false, style = "published" }: Props) {
  const isPublished = style === "published";

  return (
    <div className={`flex items-center space-x-2 mb-2 opacity-80 ${className}`}>
      {isPublished ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`${size === "sm" ? "scale-90" : "scale-100"
            } inline-block h-6 w-6 fill-skin-base`}
          aria-hidden="true"
        >
          <path d="M7 11h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z"></path>
          <path d="M5 22h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2zM19 8l.001 12H5V8h14z"></path>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`${size === "sm" ? "scale-90" : "scale-100"
            } inline-block h-6 w-6 icon icon-tabler icon-tabler-edit`}
          aria-hidden="true"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
          <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
          <path d="M16 5l3 3"></path>
        </svg>
      )}
      <span className={`italic ${size === "sm" ? "text-sm" : "text-base"}`}>
        {isPublished ? "Published:" : "Updated:"} <FormattedDatetime datetime={datetime} showTime={showTime} />
      </span>
    </div>
  );
}

const FormattedDatetime = ({ datetime, showTime }: { datetime: string | Date, showTime: boolean }) => {
  const myDatetime = new Date(datetime);

  const date = myDatetime.toLocaleDateString(LOCALE, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const time = myDatetime.toLocaleTimeString(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      {date}
      {showTime &&
        <>
          <span aria-hidden="true"> | </span>
          <span className="sr-only">&nbsp;at&nbsp;</span>
          {time}
        </>
      }
    </>
  );
};
