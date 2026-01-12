import { Button } from "@/components/ui/Button"

export default function DebtBurner() {
    return (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-red-500/10 border-red-500/20">
            <span>Current Debt: $45,000</span>
            <Button variant="destructive" size="sm">Burn Debt</Button>
        </div>
    )
}
