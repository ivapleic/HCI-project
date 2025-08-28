type LogoProps = {
    theme?: "light" | "dark";
    className?: string;
  };
  
  const Logo = ({ theme = "light", className = "" }: LogoProps) => {
    return (
      <p className={`font-lato font-bold text-3xl ${className}`}>
        {theme === "light" ? (
          <>
            <span className="font-normal text-[#593E2E]">Next</span>
            <span className="font-bold text-[#593E2E]">Reads</span>
          </>
        ) : (
          <>
            <span className="text-[#593E2E]">Next</span>
            <span className="font-bold text-[#593E2E]">Reads</span>
          </>
        )}
      </p>
    );
  };
  
  export default Logo;
  