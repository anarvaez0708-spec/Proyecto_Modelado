import { cn } from "./utils";
import { CheckIcon } from "lucide-react";

export function FormStepIndicator({ steps, currentStep = 0, className }) {
    const total = Array.isArray(steps) ? steps.length : Number(steps) || 0;
    const labels = Array.isArray(steps) ? steps : Array.from({ length: total }, (_, i) => `Paso ${i + 1}`);
    return (
        <div className={cn("w-full", className)}>
            <div className="flex items-start justify-between relative">
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-border -z-10" aria-hidden />
                {labels.map((label, idx) => {
                    const isDone = idx < currentStep;
                    const isActive = idx === currentStep;
                    return (
                        <div key={idx} className="flex flex-col items-center gap-2 flex-1 z-10">
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center border-2 text-sm font-semibold transition-colors shrink-0",
                                    isDone && "bg-primary border-primary text-primary-foreground",
                                    isActive && "bg-background border-primary text-primary",
                                    !isDone && !isActive && "bg-muted border-border text-muted-foreground"
                                )}
                            >
                                {isDone ? <CheckIcon className="h-5 w-5" /> : idx + 1}
                            </div>
                            <div
                                className={cn(
                                    "text-xs font-medium text-center max-w-[120px]",
                                    isActive && "text-primary",
                                    isDone && "text-foreground",
                                    !isDone && !isActive && "text-muted-foreground"
                                )}
                            >
                                {label}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
