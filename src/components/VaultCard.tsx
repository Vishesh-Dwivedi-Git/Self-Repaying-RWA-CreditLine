import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export default function VaultCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Vault #123</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <p>Collateral: $100,000</p>
                    <p>Debt: $45,000</p>
                </div>
            </CardContent>
        </Card>
    )
}
