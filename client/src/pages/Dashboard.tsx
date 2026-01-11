import { useQuery } from '@tanstack/react-query'
import { statsService } from '../services/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: statsService.getStats,
  })

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  const statsData = stats?.stats

  const chartData = statsData?.jobsByStatus?.map(item => ({
    name: item._id,
    count: item.count
  })) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your job search progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Jobs</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {statsData?.totalJobs || 0}
              </p>
            </div>
            <div className="text-4xl">💼</div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Applications</p>
              <p className="text-3xl font-bold text-primary-600 mt-2">
                {statsData?.activeApplications || 0}
              </p>
            </div>
            <div className="text-4xl">📝</div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Interviews</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {statsData?.upcomingInterviews || 0}
              </p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Response Rate</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {statsData?.responseRate || 0}%
              </p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Applications by Status</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#0ea5e9" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Jobs */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {statsData?.recentJobs?.map((job) => (
            <div key={job._id} className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="flex items-center space-x-4">
                {job.company?.logo && (
                  <img src={job.company.logo} alt="" className="w-10 h-10 rounded" />
                )}
                <div>
                  <p className="font-medium text-gray-900">{job.position}</p>
                  <p className="text-sm text-gray-600">{job.company?.name || 'No company'}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`badge ${getStatusColor(job.status)}`}>
                  {job.status}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(job.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    Wishlist: 'bg-gray-100 text-gray-800',
    Applied: 'bg-blue-100 text-blue-800',
    Interview: 'bg-yellow-100 text-yellow-800',
    Offer: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
    Accepted: 'bg-green-100 text-green-800',
    Declined: 'bg-gray-100 text-gray-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
