import { Loader2 } from "lucide-react";

const Loading = () => (
  <div className="flex justify-center items-center h-full">
    <Loader2 className="animate-spin duration-10000 rounded-full size-4" />
    <p className="text-muted-foreground ml-2">Loading...</p>
  </div>
);

export default Loading;
