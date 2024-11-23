export interface Props {
  score?: string;
  className?: string;
  size?: "sm" | "lg";
  showDescription?: boolean;
}

function NexusScore({
  score = "XX",
  className,
  size = "lg",
  showDescription = false,
}: Props) {
  // Receiver SVGs
  const R_Fragment = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-circle"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
    </svg>
  );

  const R_Basic = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-circle"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
    </svg>
  );

  const R_Developed = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-circle"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
    </svg>
  );

  const R_Advanced = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-circle-half"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
      <path d="M12 3v18"></path>
    </svg>
  );

  const R_Integrated = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-circle-triangle"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
      <path d="M12 20l7 -12h-14z"></path>
    </svg>
  );

  // Hub SVGs
  const H_Fragment = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-circle-dashed"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M8.56 3.69a9 9 0 0 0 -2.92 1.95"></path>
      <path d="M3.69 8.56a9 9 0 0 0 -.69 3.44"></path>
      <path d="M3.69 15.44a9 9 0 0 0 1.95 2.92"></path>
      <path d="M8.56 20.31a9 9 0 0 0 3.44 .69"></path>
      <path d="M15.44 20.31a9 9 0 0 0 2.92 -1.95"></path>
      <path d="M20.31 15.44a9 9 0 0 0 .69 -3.44"></path>
      <path d="M20.31 8.56a9 9 0 0 0 -1.95 -2.92"></path>
      <path d="M15.44 3.69a9 9 0 0 0 -3.44 -.69"></path>
    </svg>
  );

  const H_Basic = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-topology-ring-2"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M14 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M7 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M21 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M7 18h10"></path>
      <path d="M18 16l-5 -8"></path>
      <path d="M11 8l-5 8"></path>
    </svg>
  );

  const H_Developed = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-topology-ring-3"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M8 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M20 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M20 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M8 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M6 8v8"></path>
      <path d="M18 16v-8"></path>
      <path d="M8 6h8"></path>
      <path d="M16 18h-8"></path>
    </svg>
  );

  const H_Advanced = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-topology-ring-3"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M8 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M20 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M20 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M8 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M6 8v8"></path>
      <path d="M18 16v-8"></path>
      <path d="M8 6h8"></path>
      <path d="M16 18h-8"></path>
    </svg>
  );

  const H_Integrated = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-topology-ring-3"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M8 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M20 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M20 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M8 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M6 8v8"></path>
      <path d="M18 16v-8"></path>
      <path d="M8 6h8"></path>
      <path d="M16 18h-8"></path>
    </svg>
  );

  // Transmitter SVGs
  const T_Fragment = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-topology-star-ring-3"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M10 19a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M18 5a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M10 5a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M6 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M18 19a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M14 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M22 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M6 12h4"></path>
      <path d="M14 12h4"></path>
      <path d="M15 7l-2 3"></path>
      <path d="M9 7l2 3"></path>
      <path d="M11 14l-2 3"></path>
      <path d="M13 14l2 3"></path>
      <path d="M10 5h4"></path>
      <path d="M10 19h4"></path>
      <path d="M17 17l2 -3"></path>
      <path d="M19 10l-2 -3"></path>
      <path d="M7 7l-2 3"></path>
      <path d="M5 14l2 3"></path>
    </svg>
  );

  const T_Basic = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-topology-star"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M8 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M20 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M8 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M20 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M14 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M7.5 7.5l3 3"></path>
      <path d="M7.5 16.5l3 -3"></path>
      <path d="M13.5 13.5l3 3"></path>
      <path d="M16.5 7.5l-3 3"></path>
    </svg>
  );

  const T_Developed = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-topology-star-2"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M14 20a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M14 4a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M6 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M22 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M14 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M6 12h4"></path>
      <path d="M14 12h4"></path>
      <path d="M12 6v4"></path>
      <path d="M12 14v4"></path>
    </svg>
  );

  const T_Advanced = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-topology-star-3"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M10 19a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M18 5a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M10 5a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M6 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M18 19a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M14 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M22 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
      <path d="M6 12h4"></path>
      <path d="M14 12h4"></path>
      <path d="M15 7l-2 3"></path>
      <path d="M9 7l2 3"></path>
      <path d="M11 14l-2 3"></path>
      <path d="M13 14l2 3"></path>
    </svg>
  );

  const T_Integrated = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-topology-star-ring-3"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M10 19a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
        <path d="M18 5a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
        <path d="M10 5a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
        <path d="M6 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
        <path d="M18 19a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
        <path d="M14 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
        <path d="M22 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
        <path d="M6 12h4"></path>
        <path d="M14 12h4"></path>
        <path d="M15 7l-2 3"></path>
        <path d="M9 7l2 3"></path>
        <path d="M11 14l-2 3"></path>
        <path d="M13 14l2 3"></path>
        <path d="M10 5h4"></path>
        <path d="M10 19h4"></path>
        <path d="M17 17l2 -3"></path>
        <path d="M19 10l-2 -3"></path>
        <path d="M7 7l-2 3"></path>
        <path d="M5 14l2 3"></path>
      </svg>
  );

  const XX = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-point"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
    </svg>
  );

  // Replace with your SVG content for other scores if needed
  const svgs = {
    R_Fragment: R_Fragment,
    R_Basic: R_Basic,
    R_Developed: R_Developed,
    R_Advanced: R_Advanced,
    R_Integrated: R_Integrated,
    H_Fragment: H_Fragment,
    H_Basic: H_Basic,
    H_Developed: H_Developed,
    H_Advanced: H_Advanced,
    H_Integrated: H_Integrated,
    T_Fragment: T_Fragment,
    T_Basic: T_Basic,
    T_Developed: T_Developed,
    T_Advanced: T_Advanced,
    T_Integrated: T_Integrated,
    XX: XX,
    // You can continue to add more SVGs for other scores as required
  };

  function getDisplayName(score: string) {
    return score
      .replace("R_", "Receiver ")
      .replace("H_", "Hub ")
      .replace("T_", "Transmitter ")
      .split(" ")
      .reverse()
      .join(" ");
  }

  return (
    <span className={`nexus-score flex items-center ${className}`}>
      {showDescription && <span className="mr-3 text-lg">Nexus Score</span>}{" "}
      <span className={`${size === "sm" ? "scale-75" : "scale-100"}`}>
        {svgs[score as keyof typeof svgs] || svgs["XX"]}
      </span>{" "}
      {showDescription && (
        <span className="ml-3 text-lg">
          <code>{getDisplayName(score)}</code>
        </span>
      )}
    </span>
  );
}

export default NexusScore;
