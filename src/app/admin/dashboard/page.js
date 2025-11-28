export default function DefaultDashboardPage() {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Welcome, Admin!</h2>
            <p className="text-gray-800">This is your dashboard. Use the sidebar to navigate and manage your digital invitations.</p>
            <p className="mt-4 text-sm text-gray-800">
                Start by navigating to "Invitations" to view or create new wedding invitations.
            </p>
        </div>
    );
}
