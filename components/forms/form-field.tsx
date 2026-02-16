import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormFieldProps {
    label: string;
    name: string;
    id: string;
    placeholder?: string;
    required?: boolean;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
    ) => void;
    error?: string;
    helperText?: string;
    textarea?: boolean;
}

export default function FormField({ 
    label, 
    name, 
    id, 
    placeholder, 
    required, 
    onChange, 
    error, 
    helperText,
    textarea,
}: FormFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            {textarea ? (
                <Textarea 
                    id={id} 
                    name={name} 
                    placeholder={placeholder} 
                    onChange={
                        onChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void
                    }
                    required={required}
                />
            ) : (
                <Input 
                    id={id} 
                    name={name} 
                    placeholder={placeholder} 
                    onChange={
                        onChange as (e: React.ChangeEvent<HTMLInputElement>) => void
                    }
                    required={required}
                />
            )}

            {helperText && (
                <p className="text-muted-foreground text-xs">{helperText}</p>
            )}
            {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
    )
}