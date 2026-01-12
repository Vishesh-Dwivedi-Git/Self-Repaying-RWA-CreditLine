export default function ActivityFeed() {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Recent Activity</h3>
            <ul className="space-y-2">
                <li className="text-sm border-b py-2">Deposited 10 ETH</li>
                <li className="text-sm border-b py-2">Borrowed 5000 USDC</li>
                <li className="text-sm border-b py-2">Repaid 200 USDC</li>
            </ul>
        </div>
    )
}
