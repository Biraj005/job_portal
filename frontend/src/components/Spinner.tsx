import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function SpinnerButton() {
  return (
    <div className="flex flex-col items-center gap-4 h-full w-full  justify-center">
      <Button disabled size="sm" className="mt-20 h-10">
        <Spinner data-icon="inline-start"  />
        Loading...
      </Button>
    </div>
  );
}
