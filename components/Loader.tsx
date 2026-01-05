import Image from 'next/image';

const Loader = () => {
  return (
    <div className="flex-center h-screen w-full bg-bg-primary">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/icons/loading-circle.svg"
          alt="Loading"
          width={40}
          height={40}
          className="animate-spin opacity-60"
        />
        <span className="text-sm text-fg-tertiary">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
