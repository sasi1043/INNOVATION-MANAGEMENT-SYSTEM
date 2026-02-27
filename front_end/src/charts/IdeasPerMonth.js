import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function IdeasPerMonth({ ideas }) {

  const monthlyData = {};

ideas.forEach((idea) => {
  const date = new Date(idea.createdByAt);

  // Get week number
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);

  const weekKey = `Week ${weekNumber}`;

  monthlyData[weekKey] = (monthlyData[weekKey] || 0) + 1;
});

const data = Object.keys(monthlyData).map((key) => ({
  month: key,   // keeping same key name so chart doesn't change
  ideas: monthlyData[key]
}));
  return (
    <div className="card shadow-sm rounded-4 p-4">
      <h5>Ideas Per week</h5>
      <div style={{ height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="ideas" fill="#0d6efd" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default IdeasPerMonth;